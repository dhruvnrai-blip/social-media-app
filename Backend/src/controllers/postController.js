const{
 createPost,
 getFeed,
 getUserPosts,
 likePost,
 unlikePost,
 createComment,
 getComments,
 deleteComment,
 deletePost,
 bookmarkPost,
 unbookmarkPost,
 getBookmarkedPosts
}=require("../services/postService");

const create=async(req,res)=>{
 try{
  const post=await createPost(
   req.user.userId,
   req.body
  );

  res.status(201).json(post);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const feed=async(req,res)=>{
 try{
  const posts=await getFeed(
    req.user.userId
  );

  res.status(200).json(posts);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const userPosts=async(req,res)=>{
 try{
  const posts=await getUserPosts(
    req.params.username,
    req.user.userId
  );

  res.status(200).json(posts);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const like=async(req,res)=>{
 try{
  const result=await likePost(
   req.user.userId,
   req.params.postId
  );

  res.status(200).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const unlike=async(req,res)=>{
 try{
  const result=await unlikePost(
   req.user.userId,
   req.params.postId
  );

  res.status(200).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const comment=async(req,res)=>{
 try{
  const result=await createComment(
   req.user.userId,
   req.params.postId,
   req.body.content
  );

  res.status(201).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const comments=async(req,res)=>{
 try{
  const result=await getComments(
   req.params.postId
  );

  res.status(200).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const removeComment=async(req,res)=>{
 try{
  const result=await deleteComment(
   req.user.userId,
   req.params.commentId
  );

  res.status(200).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const remove=async(req,res)=>{
 try{
  const result=await deletePost(
   req.user.userId,
   req.params.postId
  );

  res.status(200).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const bookmark=async(req,res)=>{
 try{
  const result=await bookmarkPost(
   req.user.userId,
   req.params.postId
  );

  res.status(200).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const unbookmark=async(req,res)=>{
 try{
  const result=await unbookmarkPost(
   req.user.userId,
   req.params.postId
  );

  res.status(200).json(result);
 }catch(err){
  res.status(400).json({
   message:err.message
  });
 }
};

const bookmarkedPosts=async(req,res)=>{
 try{

  const posts=
   await getBookmarkedPosts(
    req.user.userId
   );

  res.status(200).json(posts);

 }catch(err){

  res.status(400).json({
   message:err.message
  });

 }
};

module.exports={
 create,
 feed,
 userPosts,
 like,
 unlike,
 comment,
 comments,
 removeComment,
 remove,
 bookmark,
 unbookmark,
 bookmarkedPosts
};