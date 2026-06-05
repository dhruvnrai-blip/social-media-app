const prisma = require("../config/prisma");
const getMyProfile =
async (userId) => {
    const user=await prisma.user.findUnique({
    where:{id:userId},
    select:{
     id:true,
     username:true,
     email:true,
     firstName:true,
     lastName:true,
     bio:true,
     profilePicture:true,
     bannerImage:true,
     location:true,
     website:true,
     isPrivate:true,
     createdAt:true,
     _count:{
     select:{
      followers:true,
      following:true
      }
     }
    }
   });
    if (!user) {
        throw new Error(
            "User not found"
        );
    }
    return{
    ...user,
    followersCount:user._count.followers,
    followingCount:user._count.following
    };
    return user;
};
const updateProfile =
async (userId,data)=>{
    const {
        firstName,
        lastName,
        bio,
        location,
        website,
        isPrivate
    } = data;
    const updatedUser =
        await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                firstName,
                lastName,
                bio,
                location,
                website,
                isPrivate
            },
            select:{
                id:true,
                username:true,
                email:true,
                firstName:true,
                lastName:true,
                bio:true,
                profilePicture:true,
                location:true,
                website:true,
                isPrivate:true
            }
        });
    return updatedUser;
};
const getUserProfile =
async (username)=>{
    const user=await prisma.user.findUnique({
     where:{username},
     select:{
      id:true,
      username:true,
      firstName:true,
      lastName:true,
      bio:true,
      profilePicture:true,
      bannerImage:true,
      location:true,
      website:true,
      isPrivate:true,
      createdAt:true,
      _count:{
       select:{
        followers:true,
        following:true
       }
      }
     }
    });
    if(!user){
        throw new Error(
            "User not found"
        );
    }
    return{
    ...user,
    followersCount:user._count.followers,
    followingCount:user._count.following
    };
};
const updateProfilePicture =
async (
    userId,
    imageUrl
)=>{
    const user =
    await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            profilePicture:
            imageUrl
        },
        select:{
            id:true,
            username:true,
            profilePicture:true
        }
    });
    return user;
};
const updateBannerImage =
async (
    userId,
    imageUrl
)=>{
    return await prisma
    .user
    .update({
        where:{
            id:userId
        },
        data:{
            bannerImage:
            imageUrl
        },
        select:{
            id:true,
            username:true,
            bannerImage:true
        }
    });
};

const searchUsers=async(query)=>{
 if(!query?.trim()) return [];

 return prisma.user.findMany({
  where:{
   OR:[
    {
     username:{
      contains:query,
      mode:"insensitive"
     }
    },
    {
     firstName:{
      contains:query,
      mode:"insensitive"
     }
    },
    {
     lastName:{
      contains:query,
      mode:"insensitive"
     }
    }
   ]
  },
  select:{
   id:true,
   username:true,
   firstName:true,
   lastName:true,
   profilePicture:true
  },
  take:10
 });
};

module.exports = {
    getMyProfile,
    updateProfile,
    getUserProfile,
    updateProfilePicture,
    updateBannerImage,
    searchUsers
};