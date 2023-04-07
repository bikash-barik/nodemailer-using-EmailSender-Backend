import asyncHandler from "express-async-handler";
import SubUser from "../models/subUserModel.js";
import Permission from "../models/permissionModel.js";

//@description     Add permissions for a user
//@route           POST /api/permissions/:userId
//@access          Private (admin only)
const addPermissions = asyncHandler(async (req, res) => {
  const user = req.user;
  if(!user.name && user.privilege !== "superAdmin"){
    res.status(400);
    throw new Error("You are not authorized to do this");
  }
  const subUserId = req.params.subUserId;
  const permissions = req.body.permissions;

  const subUser = await SubUser.findById(subUserId);

  if (!subUser) {
    res.status(404);
    throw new Error("SubUser Not Found");
  }

  // Create the permissions
  const list = permissions.map(permission => {
    return new Permission({
      subUser: subUserId,
      feature: permission.feature,
      category: permission.category,
      authorRights: permission.authorRights,
      editorRights: permission.editorRights,
      publisherRights: permission.publisherRights,
      managerRights: permission.managerRights
    });
  });

  // Save new permissions
  const savedPermissions = await Promise.all(
    list.map(async(permission) => {
      const existing = await Permission.findOne({
        subUser: permission.subUser,
        feature: permission.feature,
        category: permission.category
      })
      if(existing){
        return await Permission.findOneAndUpdate({
          subUser: permission.subUser,
          feature: permission.feature,
          category: permission.category
        }, {
          authorRights: permission.authorRights,
          editorRights: permission.editorRights,
          publisherRights: permission.publisherRights,
          managerRights: permission.managerRights
        }, {new: true});
      } else{
        return await permission.save();
      }
    })
  );

  // Return saved permissions
  res.status(201).json({
    permissions: savedPermissions
  });

});


//@description     Add permissions for a user
//@route           GET /api/permissions/:userId
//@access          Public
const fetchPermissions = asyncHandler(async (req, res) => {
  const subUserId = req.params.subUserId;
  
  const subUser = await SubUser.findById(subUserId);
  
  if (!subUser) {
    res.status(404);
    throw new Error("User Not Found");
  }
  
  // Find permissions by user ID
  const permissions = await Permission.find({ subUser: subUserId });
  

  // Return found permissions
  res.status(200).json({
    permissions: permissions
  });

});


export { addPermissions, fetchPermissions };
