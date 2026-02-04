import User from "../models/user.js";
import QuizAttempt from "../models/quizAttempt.js";

// ================= GET LOGGED-IN USER =================
export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select(
      "id name email profileImage provider isBlocked createdAt",
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user" });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, profileImage },
      { new: true, runValidators: true },
    ).select("id name email profileImage");

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Profile update failed" });
  }
};

// ================= GET USER QUIZ HISTORY =================
export const getUserQuizAttempts = async (req, res) => {
  try {
    const userId = req.user.id;

    const attempts = await QuizAttempt.find({ userId })
      .select("score startedAt endedAt quizId createdAt")
      .sort({ createdAt: -1 })
      .populate({
        path: "quizId",
        select: "id title quizType",
      });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch quiz attempts" });
  }
};

// ================= ADMIN: BLOCK / UNBLOCK USER =================
export const setUserBlockStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true },
    ).select("id name email isBlocked");

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update user status" });
  }
};

// ================= DELETE USER (OPTIONAL) =================
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete user" });
  }
};
