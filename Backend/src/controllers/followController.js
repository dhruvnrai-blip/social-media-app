const{followUser,unfollowUser,acceptFollowRequest,rejectFollowRequest,getPendingRequests,getFollowers,getFollowing,getFollowStatus}=require("../services/followService");

const follow=async(req,res)=>{
try{const result=await followUser(req.user.userId,req.params.username);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const unfollow=async(req,res)=>{
try{const result=await unfollowUser(req.user.userId,req.params.username);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const acceptRequest=async(req,res)=>{
try{const result=await acceptFollowRequest(req.user.userId,req.params.requestId);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const rejectRequest=async(req,res)=>{
try{const result=await rejectFollowRequest(req.user.userId,req.params.requestId);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const pendingRequests=async(req,res)=>{
try{const result=await getPendingRequests(req.user.userId);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const followers=async(req,res)=>{
try{const result=await getFollowers(req.params.username);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const following=async(req,res)=>{
try{const result=await getFollowing(req.params.username);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

const followStatus=async(req,res)=>{
try{const result=await getFollowStatus(req.user.userId,req.params.username);res.status(200).json(result);}
catch(err){res.status(400).json({message:err.message});}
};

module.exports={follow,unfollow,acceptRequest,rejectRequest,pendingRequests,followers,following,followStatus};