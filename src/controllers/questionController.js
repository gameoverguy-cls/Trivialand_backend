import Question from "../models/question.js";
import Option from "../models/option.js";

// CREATE QUESTION
export const createQuestion = async (req, res) => {
  try {
    const {
      questionText,
      type,
      difficulty,
      mediaType,
      mediaUrl,
      category,
      subCategories = [],
      tags = [],
      options = [],
    } = req.body;

    if (!questionText || !type || !mediaType || !difficulty || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create question
    const question = await Question.create({
      questionText,
      type,
      difficulty,
      mediaType,
      mediaUrl,
      category,
      subCategories: subCategories,
      tags: tags,
    });

    // Create options
    const optionDocs = options.map((o) => ({
      questionId: question._id,
      text: o.text,
      mediaUrl: o.mediaUrl,
      isCorrect: o.isCorrect,
      matchKey: o.matchKey,
      matchSide: o.matchSide,
      correctOrder: o.correctOrder,
    }));

    await Option.insertMany(optionDocs);

    return res.status(201).json({ success: true, message: "Question created" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE QUESTION + OPTIONS
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      questionText,
      difficulty,
      mediaUrl,
      categoryId,
      subCategoryIds = [],
      tagIds = [],
      options = [],
      deletedOptionIds = [],
    } = req.body;

    const question = await Question.findByIdAndUpdate(
      id,
      {
        questionText,
        type,
        difficulty,
        mediaUrl,
        categoryId,
        subCategories: subCategoryIds,
        tags: tagIds,
      },
      { new: true, runValidators: true },
    );

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // 1. update existing options
    const existingOptions = options.filter((o) => o.id);
    for (const opt of existingOptions) {
      await Option.findByIdAndUpdate(
        opt.id,
        {
          text: opt.text,
          mediaUrl: opt.mediaUrl,
          isCorrect: opt.isCorrect,
        },
        { new: true },
      );
    }

    // 2. create new options
    const newOptions = options.filter((o) => !o.id);
    if (newOptions.length) {
      const newOptionDocs = newOptions.map((o) => ({
        questionId: id,
        text: o.text,
        mediaUrl: o.mediaUrl,
        isCorrect: o.isCorrect,
      }));

      await Option.insertMany(newOptionDocs);
    }

    // 3. delete removed options
    if (deletedOptionIds.length) {
      await Option.deleteMany({ _id: { $in: deletedOptionIds } });
    }

    await question.populate(["options", "tags", "subCategories"]);

    return res.status(200).json({ msg: "Question updated", question });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// DELETE QUESTION
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // delete related options
    await Option.deleteMany({ questionId: id });

    return res.status(200).json({ msg: "Question deleted" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET ALL QUESTIONS
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("categoryId", "name")
      .populate("subCategories", "name")
      .populate("tags", "name")
      .populate("options")
      .sort({ createdAt: -1 });

    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET QUESTION BY ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate("categoryId", "name")
      .populate("subCategories", "name")
      .populate("tags", "name")
      .populate("options");

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
