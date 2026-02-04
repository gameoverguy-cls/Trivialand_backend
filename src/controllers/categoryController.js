import makeSlug from "../functions/slugify.js";
import Category from "../models/category.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Category name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const slugifiedName = await makeSlug(name);

    const category = await Category.create({
      name,
      slug: slugifiedName,
      description,
    });

    return res.status(201).json({ success: true, message: "Category created" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const slugifiedName = await makeSlug(name);

    category.name = name;
    category.slug = slugifiedName;
    category.description = description;
    await category.save();

    return res.status(200).json({ success: true, message: "Category updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET CATEGORY BY ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    category.isActive = !category.isActive;
    await category.save();
    return res
      .status(200)
      .json({
        success: true,
        message: `Category is ${category.isActive ? "Enabled" : "Disabled"} `,
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
