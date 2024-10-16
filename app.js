import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { StripeWebhook } from "./controller/admin/StripeController.js";
import route from "./routes/index.js"; // Ensure the path is correct
const app = express();
const PORT = process.env.PORT || 3000;

// for not parsing application/json for stripe webhook
app.post('/api/user/webhook', express.raw({ type: 'application/json' }), StripeWebhook);

// Middleware to parse application/json
app.use(express.json({ limit: "10mb" }));

// Middleware to parse application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Enable CORS
app.use(cors({ origin: "*" }));

// MongoDB connection URI
const uri = "mongodb+srv://admin:admin@cluster0.oplpgp2.mongodb.net/LaptopEcommerce";
//const uri = "mongodb://sameervers3:hk7LlOO2WOn0bNUA@ac-oduhene-shard-00-00.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-01.6k5ywbl.mongodb.net:27017,ac-oduhene-shard-00-02.6k5ywbl.mongodb.net:27017/ecom?replicaSet=atlas-rdvprw-shard-0&ssl=true&authSource=admin";

mongoose.connect(uri)
    .then(() => console.log("mongodb connected!"))
    .catch((error) => console.log("err mongodb", error.message));

// Routes
app.use("/api", route);

// Test route
app.get("/", (req, res) => {
    res.json("Running");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
