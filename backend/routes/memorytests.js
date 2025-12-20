import express from "express";
import MemoryTest from "../models/MemoryTest.js";
import { protect } from "../middleware/auth.js";
import { updateStreak } from "../utils/updateStreak.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/best", protect, async (req, res) => {
    try {
        const bestTest = await MemoryTest.findOne({testGivenBy: req.user._id})
        .sort({accuracy: -1})
        .select("accuracy createdAt");
        
        if(!bestTest){
            return res.json({});
        }

        res.json(bestTest);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

router.post("/", protect, async (req, res) => {
    const {accuracy} = req.body;
    try {
        if(typeof accuracy !== "number"){
            return res.status(400).json({
                message: "Provide valid accuracy"
            })
        }

        const test = await MemoryTest.create({
            accuracy,
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
    const history = await MemoryTest.find({
      testGivenBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("accuracy createdAt");

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;