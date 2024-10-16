import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up CloudinaryStorage with Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder in Cloudinary
    format: async () => 'jpg', // Force images to be in jpg format
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0], // File naming convention
  },
});

const upload = multer({ storage });

// Image Upload Route Handler
export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      success: false,
      message: "No file uploaded",
    });
  }

  // File has been uploaded to Cloudinary, return its URL
  res.send({
    message: "Image uploaded successfully",
    success: true,
    url: req.file.path,
  });
};

export default upload;

// Image Deletion Handler
export const deleteImage = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send({
      success: false,
      message: "No URL provided"
    });
  }

  const public_id = extractPublicId(url); // Function to extract public_id from Cloudinary URL

  if (!public_id) {
    return res.status(400).send({
      success: false,
      message: "Invalid URL"
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.send({
      message: "Image deleted successfully",
      success: true,
      result: result
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error"
    });
  }
};

// View All Images Handler
export const viewImages = async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression('resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    const images = resources.map((file) => ({
      url: file.url,
      name: file.public_id,
    }));

    res.send(images);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error"
    });
  }
};

// View Single Image Handler
export const viewImage = async (req, res) => {
  const { id } = req.params;

  try {
    const { resources } = await cloudinary.search
      .expression(`public_id:${id}`)
      .execute();

    if (resources.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Image not found"
      });
    }

    const image = {
      url: resources[0].url,
      name: resources[0].public_id,
    };

    res.send(image);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error"
    });
  }
};

// Extract public_id from Cloudinary URL (helper function)
const extractPublicId = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1].split('.')[0]; // Extract the public ID from URL
};
