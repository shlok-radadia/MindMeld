import mongoose from "mongoose";

const problemTestSchema = new mongoose.Schema(
  {
    problemsSolved: {
      type: Number,
      min: 0,
      required: true
    },
    testGivenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

problemTestSchema.index({ testGivenBy: 1, problemsSolved: -1 });

const ProblemTest = mongoose.model("ProblemTest", problemTestSchema);

export default ProblemTest;