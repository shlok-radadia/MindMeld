import mongoose from "mongoose";

const memoryTestSchema = new mongoose.Schema(
  {
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
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

memoryTestSchema.index({ testGivenBy: 1, accuracy: -1 });

const MemoryTest = mongoose.model("MemoryTest", memoryTestSchema);

export default MemoryTest;