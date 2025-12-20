import mongoose from "mongoose";

const reactionTestSchema = new mongoose.Schema(
  {
    reactionTime: {
      type: Number,
      required: true,
      min: 1,
    },
    testGivenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

reactionTestSchema.index({ testGivenBy: 1, reactionTime: 1 });

const ReactionTest = mongoose.model("ReactionTest", reactionTestSchema);

export default ReactionTest;