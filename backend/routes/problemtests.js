import express from "express";
import ProblemTest from "../models/ProblemTest.js";
import { protect } from "../middleware/auth.js";
import { updateStreak } from "../utils/updateStreak.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/best", protect, async (req, res) => {
    try {
        const bestTest = await ProblemTest.findOne({testGivenBy: req.user._id})
        .sort({problemsSolved: -1})
        .select("problemsSolved createdAt");
        
        if(!bestTest){
            return res.json({});
        }

        res.json(bestTest);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

router.post("/", protect, async (req, res) => {
    const {problemsSolved} = req.body;
    try {
        if(typeof problemsSolved !== "number"){
            return res.status(400).json({
                message: "Provide valid number of problems solved"
            })
        }

        const test = await ProblemTest.create({
            problemsSolved,
            testGivenBy: req.user._id
        })

        const user = await User.findById(req.user._id);
        updateStreak(user);
        await user.save();

        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
    }
})


router.get("/history", protect, async (req, res) => {
  try {
    const history = await ProblemTest.find({
      testGivenBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("problemsSolved createdAt");

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;