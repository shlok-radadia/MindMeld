import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/insight", protect, async (req, res) => {
  try {
    const {
      memoryAvg,
      attentionAvg,
      reactionAvg,
      problemAvg,
      streak,
      trend,
    } = req.body;

    if (
      memoryAvg == null ||
      attentionAvg == null ||
      reactionAvg == null ||
      problemAvg == null
    ) {
      return res.json({
        insight: "Complete more tests to unlock AI insights.",
      });
    }

    const prompt = `
You are an expert cognitive performance coach.

User stats:
- Memory Avg: ${memoryAvg}
- Attention Avg: ${attentionAvg}
- Reaction Avg: ${reactionAvg}
- Problem Solving Avg: ${problemAvg}
- Current Streak: ${streak}
- Progress Trend: ${trend}

Memory Test: 10 words are displayed for 10 seconds and then they are hidden. User has to guess the words. Memory Avg is actually the accuracy.
Reaction Test: A box randomly changes color and timer starts. As soon as the user clicks on the box reaction time is notes which is Reaction Avg.
Attention Test: A bunch of 0s are there and only 1 O is there and timer is started. As soon as the user finds the odd one out reaction time is noted which is Attention Avg.
Problem Solving Test: 1 minute timers is started and Problem Solving Avg is actually the number of basic Mathematics problems solved in that 1 minute.
Streak is number of consiquitive days user has given test.

Give:
1. Exactly 3 short bullet insights
2. Exactly 1 actionable improvement tip
3. Be motivating, simple, and human
4. No emojis
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // console.log(data)
    // if (!response.ok || data.error) {
    //   console.error("Gemini API error:", data.error || data);
    //   return res.json({
    //     insight: "AI insights are temporarily unavailable. Please try again later.",
    //   });
    // }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI insight unavailable.";

    res.json({ insight: text });
  } catch (err) {
    console.error("Gemini REST error:", err);
    res.status(500).json({ message: "AI service failed" });
  }
});

export default router;