import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  source: { type: String, required: true },
  target: { type: String, required: true },
  inserts: { type: Boolean, default: false },
  slipStitch: { type: Boolean, default: false },
});

export default linkSchema;
