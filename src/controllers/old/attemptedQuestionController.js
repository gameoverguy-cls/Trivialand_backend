import AttemptedQuestion from "../models/attemptedQuestion.js";
import Option from "../models/option.js";

// SUBMIT / RETRY ANSWER
export const submitAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedOptionId } = req.body;

    // find previous attempts
    const lastAttempt = await AttemptedQuestion.findOne({
      quizAttemptId: attemptId,
      questionId,
    }).sort({ attemptCount: -1 });

    const attemptCount = lastAttempt ? lastAttempt.attemptCount + 1 : 1;

    // check correctness
    let isCorrect = null;
    if (selectedOptionId) {
      const option = await Option.findById(selectedOptionId);
      isCorrect = option ? option.isCorrect : false;
    }

    const answer = await AttemptedQuestion.create({
      quizAttemptId: attemptId,
      questionId,
      selectedOptionId,
      isCorrect,
      attemptCount,
    });

    res.status(201).json({ msg: "Answer recorded", answer });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET ANSWERS FOR ATTEMPT
export const getAttemptedQuestions = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const answers = await AttemptedQuestion.find({
      quizAttemptId: attemptId,
    })
      .populate("question")
      .populate("selectedOption")
      .sort({ attemptedAt: 1 });

    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
