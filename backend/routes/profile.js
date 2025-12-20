import express from "express";
import User from "../models/User.js";
import AttentionTest from "../models/AttentionTest.js";
import MemoryTest from "../models/MemoryTest.js";
import ProblemTest from "../models/ProblemTest.js";
import ReactionTest from "../models/ReactionTest.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("username email age occupation streak longestStreak");

    
    const attentionTotal = await AttentionTest.countDocuments({ testGivenBy: userId });

    const attentionBest = await AttentionTest.findOne({ testGivenBy: userId })
      .sort({ reactionTime: 1 })
      .select("reactionTime");

    const attentionAvgAgg = await AttentionTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$reactionTime" } } },
    ]);

    const attentionLast10 = await AttentionTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("reactionTime createdAt -_id");


    const memoryTotal = await MemoryTest.countDocuments({ testGivenBy: userId });

    const memoryBest = await MemoryTest.findOne({ testGivenBy: userId })
      .sort({ accuracy: -1 })
      .select("accuracy");

    const memoryAvgAgg = await MemoryTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$accuracy" } } },
    ]);

    const memoryLast10 = await MemoryTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("accuracy createdAt -_id");

   
    const problemTotal = await ProblemTest.countDocuments({ testGivenBy: userId });

    const problemBest = await ProblemTest.findOne({ testGivenBy: userId })
      .sort({ problemsSolved: -1 })
      .select("problemsSolved");

    const problemAvgAgg = await ProblemTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$problemsSolved" } } },
    ]);

    const problemLast10 = await ProblemTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("problemsSolved createdAt -_id");

    
    const reactionTotal = await ReactionTest.countDocuments({ testGivenBy: userId });

    const reactionBest = await ReactionTest.findOne({ testGivenBy: userId })
      .sort({ reactionTime: 1 })
      .select("reactionTime");

    const reactionAvgAgg = await ReactionTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$reactionTime" } } },
    ]);

    const reactionLast10 = await ReactionTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("reactionTime createdAt -_id");

    res.json({
      user,
      totals: {
        allTests:
          attentionTotal + memoryTotal + problemTotal + reactionTotal,
        attention: attentionTotal,
        memory: memoryTotal,
        problem: problemTotal,
        reaction: reactionTotal,
      },
      attention: {
        best: attentionBest?.reactionTime ?? null,
        avg: attentionAvgAgg[0]?.avg ?? null,
        last10: attentionLast10.map(t => ({
          value: t.reactionTime,
          createdAt: t.createdAt,
        })),
      },
      memory: {
        best: memoryBest?.accuracy ?? null,
        avg: memoryAvgAgg[0]?.avg ?? null,
        last10: memoryLast10.map(t => ({
          value: t.accuracy,
          createdAt: t.createdAt,
        })),
      },
      problem: {
        best: problemBest?.problemsSolved ?? null,
        avg: problemAvgAgg[0]?.avg ?? null,
        last10: problemLast10.map(t => ({
          value: t.problemsSolved,
          createdAt: t.createdAt,
        })),
      },
      reaction: {
        best: reactionBest?.reactionTime ?? null,
        avg: reactionAvgAgg[0]?.avg ?? null,
        last10: reactionLast10.map(t => ({
          value: t.reactionTime,
          createdAt: t.createdAt,
        })),
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/", protect, async (req, res) => {
  try {
    const { age, occupation } = req.body;

    
    if (age === undefined || occupation === undefined) {
      return res.status(400).json({
        message: "Age and occupation are required",
      });
    }

    if (typeof age !== "number" || age <= 0) {
      return res.status(400).json({
        message: "Age must be a positive number",
      });
    }

    if (typeof occupation !== "string" || occupation.trim() === "") {
      return res.status(400).json({
        message: "Occupation must be a valid string",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        age,
        occupation,
      },
      { new: true }
    ).select("username email age occupation");

    res.json({
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/heatmap", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const since = new Date();
    since.setDate(since.getDate() - 91);

    const collections = [
      AttentionTest,
      MemoryTest,
      ReactionTest,
      ProblemTest,
    ];

    const counts = {};

    for (const Model of collections) {
      const results = await Model.aggregate([
        {
          $match: {
            testGivenBy: userId,
            createdAt: { $gte: since },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      results.forEach(({ _id, count }) => {
        counts[_id] = (counts[_id] || 0) + count;
      });
    }

    res.json(counts);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;