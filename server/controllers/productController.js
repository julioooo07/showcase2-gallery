
import Product from "../models/Product.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 });

        res.status(200).json(products);

    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            message: "Failed to fetch products",
        });
    }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Get Product Error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, image } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            image == null ||
            typeof image !== "string" ||
            !image.trim() ||
            price === "" ||
            price === null ||
            price === undefined ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: "Valid name, price, and image are required.",
            });
        }

        const product = await Product.create({
            name: name.trim(),
            price: Number(price),
            description: description || "",
            image,
        });

        console.log("Product created:", product._id);

        res.status(201).json(product);

    } catch (error) {
        console.error("Create Product Error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const { name, price, description, image } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price,
                description,
                image,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        console.log("Product updated:", product._id);

        res.status(200).json(product);

    } catch (error) {
        console.error("Update Product Error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        console.log("Product deleted:", product._id);

        res.status(200).json({
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error("Delete Product Error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
};
