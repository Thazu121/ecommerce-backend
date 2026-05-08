import { productModel } from "../models/productModel.js";

export const createProduct = async (req, res, next) => {
  try {
    let { name, price, category, description, isPublic } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!name || !price || !category || !description) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    price = Number(price);

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: "Invalid price",
      });
    }

    name = name.trim().toLowerCase();
    category = category.trim().toLowerCase();

    const existing = await productModel.findOne({ name, category });

    if (existing) {
      return res.status(400).json({
        message: "Product already exists",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await productModel.create({
      name,
      price,
      category,
      description,
      image,
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);
    next(error);
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === "admin";

    const products = await productModel.find(
      isAdmin ? {} : { isPublic: true }
    );

    return res.status(200).json({
      message: "Products fetched successfully",
      product: products,
    });

  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    return res.status(200).json({
      message: "Product Found",
      product,
    });

  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    if (name && category) {
      const exists = await productModel.findOne({
        name: name.trim().toLowerCase(),
        category: category.trim().toLowerCase(),
        _id: { $ne: req.params.productId },
      });

      if (exists) {
        return res.status(400).json({
          message: "Duplicate product exists",
        });
      }
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.productId,
      { $set: updateData },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Updated successfully",
      product,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndDelete(
      req.params.productId
    );

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({
      message: "Deleted successfully",
      product,
    });

  } catch (error) {
    next(error);
  }
};

export const filterProduct = async (req, res, next) => {
  try {
    const { name, category, minPrice, maxPrice, sort, page = 1, limit = 10 } =
      req.query;

    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let q = productModel.find(query);

    if (sort === "price_asc") q = q.sort({ price: 1 });
    if (sort === "price_desc") q = q.sort({ price: -1 });

    const skip = (page - 1) * limit;

    const products = await q.skip(skip).limit(limit);

    return res.status(200).json({
      message: "Filtered products",
      count: products.length,
      products,
    });

  } catch (error) {
    next(error);
  }
};