import Quiz from "../models/quiz.js";
import Question from "../models/question.js";

// CREATE QUIZ
export const createQuiz = async (req, res) => {
  try {
    const { title, quizType = "PREDEFINED", questionIds = [] } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    // Validate questionIds
    const validQuestions = await Question.find({
      _id: { $in: questionIds },
    }).select("_id");
    const validIds = validQuestions.map((q) => q._id);

    const quiz = await Quiz.create({
      title,
      quizType,
      questions: validIds,
    });

    // populate questions
    await quiz.populate({
      path: "questions",
      populate: { path: "options" },
    });

    res.status(201).json({ msg: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// UPDATE QUIZ (title + questions)
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questionIds = [] } = req.body;

    // Validate questionIds
    const validQuestions = await Question.find({
      _id: { $in: questionIds },
    }).select("_id");
    const validIds = validQuestions.map((q) => q._id);

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title,
        questions: validIds,
      },
      { new: true, runValidators: true },
    ).populate({
      path: "questions",
      populate: { path: "options" },
    });

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    res.status(200).json({ msg: "Quiz updated", quiz });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// DELETE QUIZ
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByIdAndDelete(id);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    res.status(200).json({ msg: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET ALL QUIZZES
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate({
        path: "questions",
        populate: { path: "options" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET QUIZ BY ID
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id).populate({
      path: "questions",
      populate: { path: "options" },
    });

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
