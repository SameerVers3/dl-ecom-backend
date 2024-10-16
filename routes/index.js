import express from "express";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";
import productRoutes from "./productRoutes.js";
import uploadRoutes from "./mediaRoutes.js"
import discountRoutes from "./discountRoutes.js"

const router = express.Router();

// Mount routes
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/admin/product", productRoutes);
router.use("/admin/discount", discountRoutes);

router.use("/media", uploadRoutes )

// Root route
router.get("/", (req, res) => {
    res.send("HELLO SERVER MVC");
});

export default router;
