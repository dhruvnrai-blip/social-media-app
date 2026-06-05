const prisma=require("../config/prisma");

const followUser=async(currentUserId,username)=>{
    const targetUser=await prisma.user.findUnique({where:{username}});
    if(!targetUser) throw new Error("User not found");
    if(targetUser.id===currentUserId) throw new Error("You cannot follow yourself");

    const existingFollow=await prisma.follow.findUnique({
        where:{followerId_followingId:{followerId:currentUserId,followingId:targetUser.id}}
    });

    if(existingFollow) throw new Error("Already following");

    if(targetUser.isPrivate){
        const existingRequest=await prisma.followRequest.findUnique({
            where:{requesterId_receiverId:{requesterId:currentUserId,receiverId:targetUser.id}}
        });

        if(existingRequest) throw new Error("Follow request already sent");

        const request=await prisma.followRequest.create({data:{requesterId:currentUserId,receiverId:targetUser.id}});
        await prisma.notification.create({data:{type:"FOLLOW_REQUEST",recipientId:targetUser.id,senderId:currentUserId}});
        return request;
    }

    const follow=await prisma.follow.create({data:{followerId:currentUserId,followingId:targetUser.id}});
    await prisma.notification.create({data:{type:"NEW_FOLLOWER",recipientId:targetUser.id,senderId:currentUserId}});
    return follow;
};

const unfollowUser=async(currentUserId,username)=>{
    const targetUser=await prisma.user.findUnique({where:{username}});
    if(!targetUser) throw new Error("User not found");

    const existingFollow=await prisma.follow.findUnique({
        where:{followerId_followingId:{followerId:currentUserId,followingId:targetUser.id}}
    });

    if(!existingFollow) throw new Error("You are not following this user");

    await prisma.follow.delete({
        where:{followerId_followingId:{followerId:currentUserId,followingId:targetUser.id}}
    });

    return {message:"Unfollowed successfully"};
};

const acceptFollowRequest=async(currentUserId,requestId)=>{
const request=await prisma.followRequest.findUnique({where:{id:requestId}});
if(!request) throw new Error("Request not found");
if(request.receiverId!==currentUserId) throw new Error("Unauthorized");

await prisma.follow.create({data:{followerId:request.requesterId,followingId:currentUserId}});
await prisma.notification.create({data:{type:"FOLLOW_ACCEPTED",recipientId:request.requesterId,senderId:currentUserId}});
await prisma.followRequest.delete({where:{id:requestId}});
return{message:"Follow request accepted"};
};

const rejectFollowRequest=async(currentUserId,requestId)=>{
const request=await prisma.followRequest.findUnique({where:{id:requestId}});
if(!request) throw new Error("Request not found");
if(request.receiverId!==currentUserId) throw new Error("Unauthorized");

await prisma.followRequest.delete({where:{id:requestId}});
return{message:"Follow request rejected"};
};

const getPendingRequests=async(currentUserId)=>{
return prisma.followRequest.findMany({
where:{receiverId:currentUserId},
include:{requester:{select:{id:true,username:true,profilePicture:true,firstName:true,lastName:true}}},
orderBy:{createdAt:"desc"}
});
};

const getFollowers=async(username)=>{
const user=await prisma.user.findUnique({where:{username}});
if(!user) throw new Error("User not found");

return prisma.follow.findMany({
where:{followingId:user.id},
include:{follower:{select:{id:true,username:true,profilePicture:true,firstName:true,lastName:true}}}
});
};

const getFollowing=async(username)=>{
const user=await prisma.user.findUnique({where:{username}});
if(!user) throw new Error("User not found");

return prisma.follow.findMany({
where:{followerId:user.id},
include:{following:{select:{id:true,username:true,profilePicture:true,firstName:true,lastName:true}}}
});
};

const getFollowStatus=async(currentUserId,username)=>{
const targetUser=await prisma.user.findUnique({where:{username}});
if(!targetUser) throw new Error("User not found");

if(targetUser.id===currentUserId) return{status:"SELF"};

const follow=await prisma.follow.findUnique({where:{followerId_followingId:{followerId:currentUserId,followingId:targetUser.id}}});
if(follow) return{status:"FOLLOWING"};

const request=await prisma.followRequest.findUnique({where:{requesterId_receiverId:{requesterId:currentUserId,receiverId:targetUser.id}}});
if(request) return{status:"PENDING"};

return{status:"NOT_FOLLOWING"};
};

module.exports={followUser,unfollowUser,acceptFollowRequest,rejectFollowRequest,getPendingRequests,getFollowers,getFollowing,getFollowStatus};