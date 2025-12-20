import express from "express";
import User from "../models/User.js";
import AttentionTest from "../models/AttentionTest.js";
import MemoryTest from "../models/MemoryTest.js";
import ReactionTest from "../models/ReactionTest.js";
import ProblemTest from "../models/ProblemTest.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("username streak longestStreak")
      .lean();

    const leaderboard = [];

    for (const user of users) {
      const userId = user._id;

      const [memory] = await MemoryTest.aggregate([
        { $match: { testGivenBy: userId } },
        { $group: { _id: null, avg: { $avg: "$accuracy" } } },
      ]);

      const [attention] = await AttentionTest.aggregate([
        { $match: { testGivenBy: userId } },
        { $group: { _id: null, avg: { $avg: "$reactionTime" } } },
      ]);

      const [reaction] = await ReactionTest.aggregate([
        { $match: { testGivenBy: userId } },
        { $group: { _id: null, avg: { $avg: "$reactionTime" } } },
      ]);

      const [problem] = await ProblemTest.aggregate([
        { $match: { testGivenBy: userId } },
        { $group: { _id: null, avg: { $avg: "$problemsSolved" } } },
      ]);


      const memoryScore = memory?.avg ?? 0;

      const attentionScore = attention?.avg
        ? Math.max(0, Math.min(100, 100 - ((attention.avg - 200) / 500) * 100))
        : 0;

      const reactionScore = reaction?.avg
        ? Math.max(0, Math.min(100, 100 - ((reaction.avg - 200) / 500) * 100))
        : 0;

      const problemScore = problem?.avg
        ? Math.min(100, (problem.avg / 20) * 100)
        : 0;


      const mindScore = Math.round(
        Math.max(
          0,
          Math.min(
            100,
            memoryScore * 0.25 +
              attentionScore * 0.25 +
              reactionScore * 0.25 +
              problemScore * 0.25
          )
        )
      );

      leaderboard.push({
        _id: userId,
        username: user.username,
        streak: user.streak,
        longestStreak: user.longestStreak,
        mindScore,
      });
    }

    leaderboard.sort((a, b) => b.mindScore - a.mindScore);

    res.json(leaderboard.slice(0, 50));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;