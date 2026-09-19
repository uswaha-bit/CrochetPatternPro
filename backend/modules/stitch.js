import mongoose from "mongoose";

// const stitchSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     required: true,
//     enum: {
//       values: ["default", "custom"],
//     },
//     default: "default",
//   },
//   layerNumber: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   isStart: {
//     type: Boolean,
//     required: true,
//     default: "false",
//   },
//   isIncrease: {
//     type: Boolean,
//     required: true,
//     default: "false",
//   },
//   //   surroundingStitches: [
//   //     {
//   //       stitchId: {
//   //         type: Schema.Types.ObjectId,
//   //         ref: "stitch",
//   //       },
//   //     },
//   //   ],
//   insertedInto: [
//     {
//       type: mongoose.Types.ObjectId,
//       ref: "stitch",
//       default: null,
//     },
//   ],
//   next: {
//     type: mongoose.Types.ObjectId,
//     ref: "stitch",
//     default: null,
//   },
//   previous: {
//     type: mongoose.Types.ObjectId,
//     ref: "stitch",
//     default: null,
//   },
//   x: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   y: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   z: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   vx: {
//     type: Number,
//     required: false,
//     default: 0,
//   },
//   vy: {
//     type: Number,
//     required: false,
//     default: 0,
//   },
//   vz: {
//     type: Number,
//     required: false,
//     default: 0,
//   },
//   color: {
//     type: String,
//     default: null,
//   },
// });

// const stitch = mongoose.model("stitch", stitchSchema);
// export { stitch };

const stitchSchema = new mongoose.Schema({
  id: { type: String, required: true }, // frontend UUID
  type: { type: String, required: true },
  layer: { type: Number, required: true, default: 0 },
  index: { type: Number, required: true },
  start: { type: Boolean, default: false },
  isIncrease: { type: Boolean, default: false },
  inserts: { type: String, default: null },
  previous: { type: String, default: null },
  surroundingNodes: [{ type: String }],

  color: { type: String, required: true },

  x: { type: Number, required: false },
  y: { type: Number, required: false },
  z: { type: Number, required: false },
});

export default stitchSchema;
