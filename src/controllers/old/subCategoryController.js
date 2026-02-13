// import SubCategory from "../models/subCategory.js";
// import Category from "../../models/category.js";

// // ================= CREATE SUBCATEGORY =================
// export const createSubCategory = async (req, res) => {
//   try {
//     const { name, categoryId } = req.body;

//     if (!name || !categoryId) {
//       return res.status(400).json({ msg: "Name and categoryId are required" });
//     }

//     // Check if category exists
//     const categoryExists = await Category.findById(categoryId);
//     if (!categoryExists) {
//       return res.status(404).json({ msg: "Category not found" });
//     }

//     // Check duplicate
//     const duplicate = await SubCategory.findOne({ name, categoryId });
//     if (duplicate) {
//       return res
//         .status(400)
//         .json({ msg: "SubCategory already exists in this category" });
//     }

//     const subCategory = await SubCategory.create({ name, categoryId });

//     return res.status(201).json({ msg: "SubCategory created", subCategory });
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // ================= UPDATE SUBCATEGORY =================
// export const updateSubCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, categoryId } = req.body;

//     if (!name || !categoryId) {
//       return res.status(400).json({ msg: "Name and categoryId are required" });
//     }

//     // Check duplicate
//     const duplicate = await SubCategory.findOne({
//       name,
//       categoryId,
//       _id: { $ne: id },
//     });
//     if (duplicate) {
//       return res
//         .status(400)
//         .json({ msg: "Duplicate SubCategory in this category" });
//     }

//     const subCategory = await SubCategory.findByIdAndUpdate(
//       id,
//       { name, categoryId },
//       { new: true, runValidators: true },
//     );

//     if (!subCategory) {
//       return res.status(404).json({ msg: "SubCategory not found" });
//     }

//     return res.status(200).json({ msg: "SubCategory updated", subCategory });
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // ================= DELETE SUBCATEGORY =================
// export const deleteSubCategory = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const subCategory = await SubCategory.findByIdAndDelete(id);

//     if (!subCategory) {
//       return res.status(404).json({ msg: "SubCategory not found" });
//     }

//     return res.status(200).json({ msg: "SubCategory deleted" });
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // ================= GET ALL SUBCATEGORIES =================
// export const getSubCategories = async (req, res) => {
//   try {
//     const subCategories = await SubCategory.find()
//       .populate("categoryId", "name")
//       .sort({ createdAt: -1 });

//     return res.status(200).json(subCategories);
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // ================= GET SUBCATEGORY BY ID =================
// export const getSubCategoryById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const subCategory = await SubCategory.findById(id).populate(
//       "categoryId",
//       "name",
//     );

//     if (!subCategory) {
//       return res.status(404).json({ msg: "SubCategory not found" });
//     }

//     return res.status(200).json(subCategory);
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };
