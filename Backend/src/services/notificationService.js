const prisma=require("../config/prisma");

const getNotifications=async(currentUserId)=>{
return prisma.notification.findMany({
where:{recipientId:currentUserId},
include:{sender:{select:{id:true,username:true,profilePicture:true,firstName:true,lastName:true}}},
orderBy:{createdAt:"desc"}
});
};

const markAsRead=async(currentUserId,notificationId)=>{
const notification=await prisma.notification.findUnique({where:{id:notificationId}});
if(!notification) throw new Error("Notification not found");
if(notification.recipientId!==currentUserId) throw new Error("Unauthorized");

return prisma.notification.update({where:{id:notificationId},data:{isRead:true}});
};

module.exports={getNotifications,markAsRead};