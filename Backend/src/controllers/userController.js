const {getMyProfile, updateProfile, getUserProfile, updateProfilePicture, updateBannerImage, searchUsers} = require("../services/userService");
const cloudinary = require("../config/cloudinary");
const getMyProfileController =
async (req,res)=>{
    try{
        const user =
            await getMyProfile(
                req.user.userId
            );
        res.status(200).json({
            success:true,
            user
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
};
const updateProfileController =
async (req,res)=>{
    try{
        const updatedUser =
            await updateProfile(
                req.user.userId,
                req.body
            );
        res.status(200).json({
            success:true,
            user:updatedUser
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
};
const getUserProfileController =
async (req,res)=>{
    try{
        const user =
            await getUserProfile(
                req.params.username
            );
        res.status(200).json({
            success:true,
            user
        });
    }
    catch(error){
        res.status(404).json({
            success:false,
            message:error.message
        });
    }
};

const updateProfilePictureController =
async (req,res)=>{
    try{
        if(!req.file){return res.status(400)
            .json({
                success:false,
                message:
                "No file uploaded"
            });
        }
        const uploaded = await cloudinary.uploader
        .upload(
            `data:${
            req.file
            .mimetype
            };base64,${
            req.file
            .buffer
            .toString(
                "base64"
            )
            }`
        );
        const user =
        await updateProfilePicture(
            req.user.userId,
            uploaded.secure_url
        );
        res.status(200)
        .json({
            success:true,
            user
        });
    }
    catch(error){
        console.error(error);
        res.status(500)
        .json({
            success:false,
            message:
            error.message
        });
    }
};
const updateBannerController =
async (
    req, res
)=>{
    try{
        if(!req.file){
            return res
            .status(400)
            .json({
                success:false,
                message:
                "No file uploaded"
            });
        }
        const uploaded =
        await cloudinary
        .uploader
        .upload(
            `data:${
            req.file
            .mimetype
            };base64,${
            req.file
            .buffer
            .toString(
                "base64"
            )
            }`
        );
        const user =
        await updateBannerImage(
            req.user.userId,
            uploaded.secure_url
        );
        res.status(200)
        .json({
            success:true,
            user
        });
    }
    catch(error){
        console.error(error);
        res.status(500)
        .json({
            success:false,
            message:
            error.message
        });
    }
};

const searchUsersController=
async(req,res)=>{
 try{
  const users=
   await searchUsers(
    req.query.q
   );

  res.status(200).json({
   success:true,
   users
  });
 }catch(error){
  res.status(500).json({
   success:false,
   message:error.message
  });
 }
};

module.exports = {
    getMyProfileController,
    updateProfileController,
    getUserProfileController,
    updateProfilePictureController,
    updateBannerController,
    searchUsersController
};