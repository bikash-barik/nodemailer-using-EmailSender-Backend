// Videos
import asyncHandler from "express-async-handler";
import Achievement from "../../models/Manage Application/achievementModel.js";
import Permission from "../../models/permissionModel.js";

// @desc    Create new Achievement
// @route   POST /api/achievement
// @access  Private (requires author rights)
const createAchievement = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user.name && user.privilege !== "superAdmin") {
    const permission = await Permission.find({
      subUser: user._id,
      category: "application",
      feature: "achievement",
    });

    if (permission.length === 0) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
    if (!(permission[0].authorRights === true)) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
  }
  const { sl_no, achievement_name, snippet, description, publish_status } =
    req.body;

  const newAchievement = new Achievement({
    sl_no,
    achievement_name,
    snippet,
    description,
    publish_status,
  });

  await newAchievement.save();

  res.status(200).json({
    achievement: newAchievement,
  });
});

// @desc    Get all Achievements
// @route   GET /api/achievement
// @access  Private (requires manager rights)
const getAchievements = asyncHandler(async (req, res) => {
  // const user = req.user;
  // if (!user.name && user.privilege !== "superAdmin") {
  //   const permission = await Permission.find({
  //     subUser: user._id,
  //     category: "application",
  //     feature: "achievement",
  //   });

  //   if (permission.length === 0) {
  //     res.status(400);
  //     throw new Error("You are not authorized to do this");
  //   }
  //   if (!(permission[0].managerRights === true)) {
  //     res.status(400);
  //     throw new Error("You are not authorized to do this");
  //   }
  // }
  const status = req.query.status;
  let query = {};
  if(status==="set"){
    query = {publish_status: "set"};
  }
  const achievements = await Achievement.find(query);

  res.status(200).json({
    achievements,
  });
});

// @desc    Get a single Achievement by id
// @route   POST /api/achievement/:id
// @access  Public
const getAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    res.status(404);
    throw new Error("Achievement Not Found");
  }

  res.status(200).json({
    achievement,
  });
});

// @desc    Update Achievement
// @route   PUT /api/achievement/:id
// @access  Private (requires editor rights)
const updateAchievement = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user.name && user.privilege !== "superAdmin") {
    const permission = await Permission.find({
      subUser: user._id,
      category: "application",
      feature: "achievement",
    });

    if (permission.length === 0) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
    if (!(permission[0].editorRights === true)) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
  }
  const achievement = await Achievement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!achievement) {
    res.status(404);
    throw new Error("Achievement Not Found");
  }

  res.status(200).json({
    achievement,
  });
});

// @desc    Delete Achievement
// @route   DELETE /api/achievement/:id
// @access  Private (requires manager rights)
const deleteAchievement = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user.name && user.privilege !== "superAdmin") {
    const permission = await Permission.find({
      subUser: user._id,
      category: "application",
      feature: "achievement",
    });

    if (permission.length === 0) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
    if (!(permission[0].managerRights === true)) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
  }
  const achievementId = req.params.id;

  const achievementToDelete = await Achievement.findById(achievementId);

  if (!achievementToDelete) {
    res.status(404);
    throw new Error("Achievement Not Found");
  }

  await achievementToDelete.remove();

  res.status(200).json({
    achievement: achievementToDelete,
  });
});

// @desc    Toggle publish status of Achievement
// @route   PUT /api/achievement/status/:id
// @access  Private (requires publisher rights)
const togglePublishStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user.name && user.privilege !== "superAdmin") {
    const permission = await Permission.find({
      subUser: user._id,
      category: "application",
      feature: "achievement",
    });

    if (permission.length === 0) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
    if (!(permission[0].publisherRights === true)) {
      res.status(400);
      throw new Error("You are not authorized to do this");
    }
  }
  const achievementId = req.params.id;

  const achievement = await Achievement.findById(achievementId);

  if (achievement) {
    if (achievement.publish_status === "set") {
      achievement.publish_status = "unset";
    } else {
      achievement.publish_status = "set";
    }
    const updatedAchievement = await achievement.save();
    res.status(200).json({
      achievement: updatedAchievement,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

export { getAchievement, getAchievements, createAchievement, updateAchievement, togglePublishStatus, deleteAchievement };