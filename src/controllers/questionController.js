import Question from "../models/questionSet.js";
import { validateQuestion } from "./validators/questionSetValidator.js";

export const createQuestion = async (req, res) => {
  try {
    const {
      questionText,
      type,
      difficulty,
      mediaType,
      mediaUrl,
      category,
      tags = [],
      options = [],
      timeLimit,
    } = req.body;

    // 🔹 validate options based on question type (important)
    if (options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 options required",
      });
    }

    const error = validateQuestion(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    // 🔹 create question with embedded options
    await Question.create({
      questionText,
      type,
      difficulty,
      mediaType,
      mediaUrl,
      category,
      tags,
      options,
      timeLimit,
      createdBy: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE QUESTION + OPTIONS
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // 🔒 Allowed PATCH fields only
    const allowedFields = [
      "questionText",
      "type",
      "difficulty",
      "mediaType",
      "mediaUrl",
      "category",
      "tags",
      "options",
      "timeLimit",
      "isActive",
      "isApproved",
    ];

    // 🧩 Apply partial updates safely
    for (const field of allowedFields) {
      if (field in req.body) {
        question[field] = req.body[field];
      }
    }

    // 🛡 Validate FULL merged question domain
    const error = validateQuestion(question.toObject());
    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    // 💾 Save document (runs mongoose validators too)
    await question.save();

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL QUESTIONS
export const getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      difficulty,
      type,
      category,
      search,
      isActive,
    } = req.query;

    const query = {};

    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (search) {
      query.questionText = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const questions = await Question.find(query)
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Question.countDocuments(query);

    return res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      data: questions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET QUESTION BY ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate("category", "name")
      .populate("tags", "name");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const toggleQuestionStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // 🔁 toggle isActive
    question.isActive = !question.isActive;

    await question.save();

    return res.status(200).json({
      success: true,
      message: `Question ${question.isActive ? "enabled" : "disabled"} successfully`,
      data: {
        id: question._id,
        isActive: question.isActive,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
