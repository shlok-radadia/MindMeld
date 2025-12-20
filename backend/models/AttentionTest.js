import mongoose from "mongoose";

const attentionTestSchema = new mongoose.Schema(
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

attentionTestSchema.index({ testGivenBy: 1, reactionTime: 1 });

const AttentionTest = mongoose.model("AttentionTest", attentionTestSchema);

export default AttentionTest;