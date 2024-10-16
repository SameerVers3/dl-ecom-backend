import dotenv from 'dotenv';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import Product from '../../models/ProductSchema.js';
import Order from '../../models/OrderSchema.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_SECRET);
const clientUrl = process.env.CLIENT_URL;

export const StripeController = async (req, res) => {
  const productIds = req.body.products;

  if (!productIds || productIds.length === 0) {
    return res.status(400).json({
      message: 'Products are required',
    });
  }

  try {
    const productIdCounts = productIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const uniqueProductIds = Object.keys(productIdCounts);

    const products = await Product.find({
      _id: { $in: uniqueProductIds },
    });

    if (products.length !== uniqueProductIds.length) {
      return res.status(400).json({
        message: 'One or more products not found',
      });
    }

    const lineItems = products.map((product) => {
      const quantity = productIdCounts[product._id.toString()];

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images?.[0] ? [product.images[0]] : [],
          },
          unit_amount: product.price * 100,
        },
        quantity: quantity,
      };
    });

    // Prepare product metadata to be used in the webhook for order processing
    const productsMetadata = products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: productIdCounts[product._id.toString()],
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${clientUrl}?success=true`,
      cancel_url: `${clientUrl}?canceled=true`,
      metadata: {
        userId: req.userId.toString(),
        products: JSON.stringify(productsMetadata),
      },
    });

    res.json({
      success: true,
      message: 'Stripe checkout URL created',
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const StripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Error verifying Stripe webhook signature:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let productIdCounts = {};

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      console.log('Checkout session completed:');

      try {
        const { payment_intent, metadata } = session;
        const { userId, products: productData } = metadata;

        // Validate and parse product data
        const parsedProducts = JSON.parse(productData);
        productIdCounts = parsedProducts.reduce((acc, item) => {
          acc[item.id] = (acc[item.id] || 0) + item.quantity;
          return acc;
        }, {});

        // Ensure all IDs are valid ObjectIds
        const invalidIds = Object.keys(productIdCounts).filter(id => !isValidObjectId(id));
        if (invalidIds.length > 0) {
          throw new Error(`Invalid ObjectId(s): ${invalidIds.join(', ')}`);
        }

        const uniqueProductIds = Object.keys(productIdCounts);

        const products = await Product.find({
          _id: { $in: uniqueProductIds },
        });

        if (products.length !== uniqueProductIds.length) {
          throw new Error('One or more products not found');
        }

        // Create order
        const items = products.map((product) => {
          const quantity = productIdCounts[product._id.toString()];
          return {
            productId: product._id,
            quantity: quantity,
            price: product.price
          };
        });

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = new Order({
          userId: userId,
          items: items,
          total: total,
          status: 'paid',
          paymentId: payment_intent
        });

        await order.save();

        console.log('Order created:', order);

        // Update stock quantity
        await Product.updateMany(
          { _id: { $in: uniqueProductIds } },
          { $inc: { stockQuantity: -1 } }  // Adjust the decrement value as needed
        );

      } catch (err) {
        console.error('Error handling checkout session:', err);

        // Rollback stock changes in case of error
        await Product.updateMany(
          { _id: { $in: Object.keys(productIdCounts) } },
          { $inc: { stockQuantity: { $each: Object.values(productIdCounts).map(q => -q) } } }
        );

        return res.status(500).json({
          message: 'Failed to process order',
          error: err.message,
        });
      }

      break;
    }

    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.async_payment_failed':
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
      console.log(`Unhandled event type: ${event.type}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).end();
};

