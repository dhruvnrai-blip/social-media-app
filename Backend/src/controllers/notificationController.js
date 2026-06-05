const{getNotifications,markAsRead}=require("../services/notificationService");

const notifications=async(req,res)=>{
try{const result=await getNotifications(req.user.userId);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const readNotification=async(req,res)=>{
try{const result=await markAsRead(req.user.userId,req.params.notificationId);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

module.exports={notifications,readNotification};