import Idea from "../models/Idea.js";
import User from "../models/User.js";

export const getAllIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      ideas,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const [totalIdeas, totalUsers, pending, completed, duplicate, rejected] =
      await Promise.all([
        Idea.countDocuments(),
        User.countDocuments(),
        Idea.countDocuments({ status: "pending" }),
        Idea.countDocuments({ status: "completed" }),
        Idea.countDocuments({ status: "duplicate" }),
        Idea.countDocuments({ status: "rejected" }),
      ]);

    res.json({
      success: true,
      stats: {
        totalIdeas,
        totalUsers,
        pending,
        completed,
        duplicate,
        rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};