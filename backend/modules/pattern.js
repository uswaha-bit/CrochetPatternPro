import mongoose from "mongoose";
import { User } from "./user.js";
import linkSchema from "./link.js";
import stitchSchema from "./stitch.js";
const patternSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "pattern should have a name"],
    default: "untitled",
  },
  stitches: { type: [stitchSchema], required: true },
  links: { type: [linkSchema], required: true },
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
     required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Pattern = mongoose.model("pattern", patternSchema);
export { Pattern };
