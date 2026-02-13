// import QuizAttempt from "../models/quizAttempt.js";
// import AttemptedQuestion from "../models/attemptedQuestion.js";

// // START QUIZ
// export const startQuizAttempt = async (req, res) => {
//   try {
//     const userId = req.user.id; // from auth middleware
//     const { quizId } = req.body;

//     const attempt = await QuizAttempt.create({
//       userId,
//       quizId,
//     });

//     res.status(201).json({ msg: "Quiz started", attempt });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // FINISH QUIZ
// export const finishQuizAttempt = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // calculate score
//     const correctCount = await AttemptedQuestion.countDocuments({
//       quizAttemptId: id,
//       isCorrect: true,
//     });

//     const attempt = await QuizAttempt.findByIdAndUpdate(
//       id,
//       {
//         score: correctCount,
//         endedAt: new Date(),
//       },
//       { new: true },
//     );

//     if (!attempt) {
//       return res.status(404).json({ msg: "Attempt not found" });
//     }

//     res.status(200).json({ msg: "Quiz finished", attempt });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // GET ATTEMPT DETAILS
// export const getQuizAttemptById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const attempt = await QuizAttempt.findById(id)
//       .populate("quizId", "title quizType")
//       .populate({
//         path: "attemptedQuestions",
//         populate: [{ path: "questionId" }, { path: "selectedOptionId" }],
//       });

//     if (!attempt) {
//       return res.status(404).json({ msg: "Attempt not found" });
//     }

//     res.status(200).json(attempt);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // USER ATTEMPT HISTORY
// export const getUserQuizAttempts = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const attempts = await QuizAttempt.find({ userId })
//       .populate("quizId", "title quizType")
//       .sort({ createdAt: -1 });

//     res.status(200).json(attempts);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };
