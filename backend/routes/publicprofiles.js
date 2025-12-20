import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import AttentionTest from "../models/AttentionTest.js";
import MemoryTest from "../models/MemoryTest.js";
import ProblemTest from "../models/ProblemTest.js";
import ReactionTest from "../models/ReactionTest.js";

const router = express.Router();


router.get("/:id", async (req, res) => {
  try {
    // const userId = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const user = await User.findById(userId)
      .select("username age occupation streak longestStreak");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const attentionTotal = await AttentionTest.countDocuments({ testGivenBy: userId });

    const attentionBest = await AttentionTest.findOne({ testGivenBy: userId })
      .sort({ reactionTime: 1 })
      .select("reactionTime");

    const attentionAvg = await AttentionTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$reactionTime" } } },
    ]);

    // console.log(attentionAvg);
    // console.log(userId)

    const attentionLast10 = await AttentionTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("reactionTime createdAt");

      
    const memoryTotal = await MemoryTest.countDocuments({ testGivenBy: userId });

    const memoryBest = await MemoryTest.findOne({ testGivenBy: userId })
      .sort({ accuracy: -1 })
      .select("accuracy");

    const memoryAvg = await MemoryTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$accuracy" } } },
    ]);

    const memoryLast10 = await MemoryTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("accuracy createdAt");

      
    const reactionTotal = await ReactionTest.countDocuments({ testGivenBy: userId });

    const reactionBest = await ReactionTest.findOne({ testGivenBy: userId })
      .sort({ reactionTime: 1 })
      .select("reactionTime");

    const reactionAvg = await ReactionTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$reactionTime" } } },
    ]);

    const reactionLast10 = await ReactionTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("reactionTime createdAt");

      
    const problemTotal = await ProblemTest.countDocuments({ testGivenBy: userId });

    const problemBest = await ProblemTest.findOne({ testGivenBy: userId })
      .sort({ problemsSolved: -1 })
      .select("problemsSolved");

    const problemAvg = await ProblemTest.aggregate([
      { $match: { testGivenBy: userId } },
      { $group: { _id: null, avg: { $avg: "$problemsSolved" } } },
    ]);

    const problemLast10 = await ProblemTest.find({ testGivenBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("problemsSolved createdAt");

      
    const since = new Date();
    since.setDate(since.getDate() - 91);

    const collections = [AttentionTest, MemoryTest, ReactionTest, ProblemTest];
    const heatmap = {};

    for (const Model of collections) {
      const results = await Model.aggregate([
        { $match: { testGivenBy: userId, createdAt: { $gte: since } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      results.forEach(r => {
        heatmap[r._id] = (heatmap[r._id] || 0) + r.count;
      });
    }

    res.json({
      user,
      totals: {
        allTests:
          attentionTotal + memoryTotal + reactionTotal + problemTotal,
        attention: attentionTotal,
        memory: memoryTotal,
        reaction: reactionTotal,
        problem: problemTotal,
      },
      attention: {
        best: attentionBest?.reactionTime ?? null,
        avg: attentionAvg[0]?.avg ?? null,
        last10: attentionLast10.map(t => ({
          value: t.reactionTime,
          createdAt: t.createdAt,
        })),
      },
      memory: {
        best: memoryBest?.accuracy ?? null,
        avg: memoryAvg[0]?.avg ?? null,
        last10: memoryLast10.map(t => ({
          value: t.accuracy,
          createdAt: t.createdAt,
        })),
      },
      reaction: {
        best: reactionBest?.reactionTime ?? null,
        avg: reactionAvg[0]?.avg ?? null,
        last10: reactionLast10.map(t => ({
          value: t.reactionTime,
          createdAt: t.createdAt,
        })),
      },
      problem: {
        best: problemBest?.problemsSolved ?? null,
        avg: problemAvg[0]?.avg ?? null,
        last10: problemLast10.map(t => ({
          value: t.problemsSolved,
          createdAt: t.createdAt,
        })),
      },
      heatmap,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;