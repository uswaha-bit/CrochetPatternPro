// import { stitch } from "../modules/stitch.js";
// import { ErrorHandler } from "../utils/errorhandler.js";

// export const createStitch = async (req, res, next) => {
//   const newStich = new stitch({
//     name: req.body.name,
//   });

//   try {
//     await newStich.save();
//     res.status(200).json({
//       success: true,
//       message: "stitch created successfuly",
//       stitch: newStich,
//     });
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 404));
//   }
// };
