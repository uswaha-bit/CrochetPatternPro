// import { stitch } from "../modules/stitch.js";
import { Pattern } from "../modules/pattern.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { User } from "../modules/user.js";
import { StatusCodes } from "http-status-codes";

// import { session } from "neo4j-driver";
import { connectGraphDB } from "../config/database.js";

import mongoose from "mongoose";
// export const createPattern = async (req, res, next) => {
//   const { name, stitches } = req.body;
//   const user = req.user.id;
//   if (!name || !user || !stitches) {
//     throw new Error("pattern can't be created from null");
//   }

//   const newPattern = new pattern({
//     name,
//     user,
//   });

//   try {
//     await newPattern.save();
//     const savedStitches = await Promise.all(
//       stitches.map(async (stitchData) => {
//         const newStitch = new stitch(stitchData);
//         await newStitch.save();
//         return newStitch._id;
//       })
//     );

//     //console.log(JSON.stringify(savedStitches, null, 2));

//     newPattern.stitches = savedStitches;
//     await newPattern.save();

//     const populatedPattern = await pattern
//       .findById(newPattern._id)
//       .populate("stitches")
//       .exec();

//     res.status(200).json({
//       success: true,
//       message: "pattern created successfuly",
//       populatedPattern,
//     });
//   } catch (error) {
//     if (error.message === "pattern can't be created from null") {
//       return next(new ErrorHandler(error.message, 400));
//     }
//     return next(
//       new ErrorHandler(error.message || "fault in creating pattern", 404)
//     );
//   }
// };

//as primitive values are not supported in neo4j hence we clean the properties of each object of stitch and link
const cleanObject = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip MongoDB _id field and null/undefined values
    if (key === "_id") continue;
    if (value !== null && value !== undefined) {
      // Convert ObjectId to string if it exists
      if (
        value &&
        typeof value === "object" &&
        value.constructor.name === "ObjectId"
      ) {
        cleaned[key] = value.toString();
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};

export const createPattern = async (req, res, next) => {
  const driver = await connectGraphDB();
  const session = driver.session();
  try {
    const { id, name, stitches, links } = req.body;

    if (!name || !stitches || stitches.length === 0) {
      return res
        .status(400)
        .json({ error: "Name, stitches, and pattern picture are required." });
    }

    const userId = req.user._id;

    let pattern;

    if (id) {
      // Try to find pattern with same ID and user
      pattern = await Pattern.findOne({ _id: id, user: userId });

      if (pattern) {
        // Overwrite existing pattern
        pattern.name = name;
        pattern.stitches = stitches;
        pattern.links = links;
        pattern.lastModified = new Date();
        await pattern.save();

        return res.status(200).json({
          success: true,
          pattern,
          message: "Pattern updated successfully",
        });
      }
    }

    // Create a new ObjectId if none is provided or not found
    const newId = id
      ? new mongoose.Types.ObjectId(id)
      : new mongoose.Types.ObjectId();

    pattern = await Pattern.create({
      _id: newId,
      name,
      user: userId,
      stitches,
      links,
      lastModified: new Date(),
    });

    const cleanedStitches = stitches.map(cleanObject);
    const cleanedLinks = links.map(cleanObject);
    await session.run(
      `
        UNWIND $stitches AS stitch
        CREATE (s:Stitch{id:stitch.id})
        SET
          s.type = COALESCE(stitch.type, null),
          s.layer = COALESCE(stitch.layer, null),
          s.index = COALESCE(stitch.index, null),
          s.start = COALESCE(stitch.start, null),
          s.x = COALESCE(stitch.x, null),
          s.y = COALESCE(stitch.y, null)
        WITH COUNT (*) AS stitchesCreated
        UNWIND $links as link
        MATCH(source:Stitch{id:link.source})
        MATCH(target:Stitch{id:link.target})
        CREATE (source)<-[r:linkedTo{inserts:link.inserts}]-(target)
        SET r.inserts = COALESCE(link.inserts, null)
        `,
      { stitches: cleanedStitches, links: cleanedLinks }
    );
    res.status(StatusCodes.CREATED).json({
      success: true,
      pattern,
      message: "Pattern created successfully",
    });
  } catch (error) {
    console.error("Message:", error.message);
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  } finally {
    await session.close();
  }
};

export const getPatterns = async (req, res, next) => {
  const user = req.user?.id;

  try {
    if (!user) {
      throw new Error("login first to fetch patterns");
    }

    const patterns = await Pattern.find({ user }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      patterns,
    });
  } catch (error) {
    if (error.message === "login first to fetch patterns") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }

    return next(
      new ErrorHandler(
        error.message || "Error fetching patterns",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getPatternById = async (req, res, next) => {
  const user = req.user?.id;

  try {
    if (!user) {
      throw new Error("login first to get patterns");
    }

    const patternToGet = await Pattern.findById(req.params.id);

    if (!patternToGet) {
      throw new Error("pattern not found");
    }

    if (patternToGet.user.toString() !== user.toString()) {
      throw new Error("unauthorized access to this pattern");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      pattern: patternToGet,
    });
  } catch (error) {
    if (error.message === "login first to get patterns") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "pattern not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "unauthorized access to this pattern") {
      return next(new ErrorHandler(error.message, StatusCodes.FORBIDDEN));
    }

    return next(
      new ErrorHandler(
        error.message || "error in getting pattern",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const deletePatternById = async (req, res, next) => {
  const user = req.user?.id;

  try {
    if (!user) {
      throw new Error("login first to delete patterns");
    }

    const patternToDelete = await Pattern.findById(req.params.id);

    if (!patternToDelete) {
      throw new Error("pattern not found");
    }

    if (patternToDelete.user.toString() !== user.toString()) {
      throw new Error("unauthorized access to delete this pattern");
    }

    await patternToDelete.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Pattern deleted successfully",
    });
  } catch (error) {
    // ✅ Log full error with stack trace
    console.error("Error in deletePatternById:", error);

    if (error.message === "login first to delete patterns") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "pattern not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "unauthorized access to delete this pattern") {
      return next(new ErrorHandler(error.message, StatusCodes.FORBIDDEN));
    }

    return next(
      new ErrorHandler(
        error.message || "error in deleting pattern",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const savePatternImage = async (req, res, next) => {
  const files = req.files;
  try {
    console.log(files);
  } catch (error) {
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};
// export const getPattern = async (req, res, next) => {
//   const user = req.user.id;
//   try {
//     if (!user) {
//       throw new Error("login first to get patterns");
//     }
//     const patternToGet = await pattern.findById(req.params.id);
//     if (!patternToGet) {
//       throw new Error("pattern not found");
//     }
//     res.status(StatusCodes.OK).json({
//       success: true,
//       patternToGet,
//     });
//   } catch (error) {
//     if (error.message === "login first to get patterns") {
//       return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
//     }
//     if (error.message === "pattern not found") {
//       return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
//     }
//     return next(
//       new ErrorHandler(
//         error.message || "error in getting pattern",
//         StatusCodes.INTERNAL_SERVER_ERROR
//       )
//     );
//   }
// };

// export const updatePattern = async (req, res, next) => {
//   const { name, stitches } = req.body;
//   const user = req.user.id;
//   if (!name || !stitches) {
//     throw new Error("both name and stitches are required");
//   }
//   try {
//     const existingPattern = await pattern.findById(req.params.id);
//     if (!existingPattern) {
//       throw new Error("pattern not found");
//     }
//     if (existingPattern.user.toString() != user) {
//       //console.log(existingPattern.user.toString());
//       throw new Error("unauthorized access, can not update pattern");
//     }
//     //updating existing stitches like their color or position

//     const updatedStitchId = await Promise.all(
//       stitches.map(async (stitchData) => {
//         if (stitchData._id) {
//           const updatedStitch = await stitch.findByIdAndUpdate(
//             stitchData._id,
//             stitchData,
//             {
//               new: true,
//               runValidators: true,
//             }
//           );
//           return updatedStitch._id;
//         } else {
//           const newStitch = new stitch(stitchData);
//           await newStitch.save();
//           return newStitch._id;
//         }
//       })
//     );

//     //comparing old stitches with new updated arraay and deleting them
//     const oldStitchIds = existingPattern.stitches.map((id) => id.toString());
//     //console.log(oldStitchIds);
//     const stitchesToDelete = oldStitchIds.filter(
//       (oldId) => !updatedStitchId.map((id) => id.toString()).includes(oldId)
//     );
//     //console.log("stitches to delete array is:", stitchesToDelete);

//     //deleting removed stitches from the database
//     if (stitchesToDelete.length) {
//       await stitch.deleteMany({ _id: { $in: stitchesToDelete } });
//     }

//     existingPattern.name = name;
//     existingPattern.stitches = updatedStitchId;
//     await existingPattern.save();

//     const populatedPattern = await pattern
//       .findById(existingPattern._id)
//       .populate("stitches")
//       .exec();

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: "pattern has been updated",
//       populatedPattern,
//     });
//   } catch (error) {
//     if (error.message === "both name and stitches are required") {
//       return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
//     }
//     if (error.message === "pattern not found") {
//       return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
//     }
//     if (error.message === "unauthorized access, can not update pattern") {
//       return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
//     }
//     return next(
//       new ErrorHandler(
//         error.message || "Error updating pattern",
//         StatusCodes.INTERNAL_SERVER_ERROR
//       )
//     );
//   }
// };

// export const deletePattern = async (req, res, next) => {
//   const user = req.user.id;

//   try {
//     const patternToDelete = await pattern.findById(req.params.id);
//     if (!patternToDelete) {
//       throw new Error("pattern not found");
//     }
//     if (patternToDelete.user.toString() != user) {
//       throw new Error("uanuthrized access");
//     }
//     const stitchesToDelete = patternToDelete.stitches.map((id) =>
//       id.toString()
//     );
//     if (stitchesToDelete.length) {
//       await stitch.deleteMany({ _id: { $in: stitchesToDelete } });
//     }
//     await patternToDelete.deleteOne({ _id: req.params.id });
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: "pattern deleted succesfully",
//     });
//   } catch (error) {
//     if (error.message === "pattern not found") {
//       return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
//     }
//     if (error.message === "unauthrized access") {
//       return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
//     }
//     return next(
//       new ErrorHandler(
//         error || "error in deleting the pattern",
//         StatusCodes.INTERNAL_SERVER_ERROR
//       )
//     );
//   }
// };
