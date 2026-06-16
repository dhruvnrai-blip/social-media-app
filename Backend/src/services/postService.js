const prisma=require("../config/prisma");

const buildPostInclude = (userId) => ({
  author: {
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      profilePicture: true
    }
  },

  repostOf: {
    include: {
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profilePicture: true
        }
      }
    }
  },

  _count: {
    select: {
      likes: true,
      comments: true,
      reposts: true
    }
  },

  likes: {
    where: { userId },
    select: { id: true }
  },

  bookmarks: {
    where: { userId },
    select: { id: true }
  },

  reposts: {
    where: { userId },
    select: { id: true }
  }
});

const mapPost = (post) => ({
  ...post,

  likesCount: post._count.likes,
  commentsCount: post._count.comments,
  repostsCount: post._count.reposts,

  isLiked: post.likes.length > 0,
  isBookmarked: post.bookmarks.length > 0,
  isReposted: post.reposts.length > 0
});

const createPost=async(userId,data)=>{
 const{content}=data;

 if(!content?.trim()){
  throw new Error("Post content is required");
 }

 return prisma.post.create({
  data:{
   content:content.trim(),
   userId
  },
  include:{
   author:{
    select:{
     id:true,
     username:true,
     firstName:true,
     lastName:true,
     profilePicture:true
    }
   }
  }
 });
};

const getFeed=async(userId)=>{
 const posts=await prisma.post.findMany({
  where:{
   isDeleted:false
  },
  include: buildPostInclude(userId),
  orderBy:{
   createdAt:"desc"
  }
 });

 return posts.map(mapPost);
};

const getUserPosts=async(username,userId)=>{
 const posts=await prisma.post.findMany({
  where:{
   isDeleted:false,
   author:{
    username
   }
  },
  include: buildPostInclude(userId),
  orderBy:{
   createdAt:"desc"
  }
 });

 return posts.map(mapPost);
};

const getUserReposts=async(username,userId)=>{

 const posts=await prisma.post.findMany({
  where:{
   isDeleted:false,
   repostOfId:{
    not:null
   },
   author:{
    username
   }
  },

  include:buildPostInclude(userId),

  orderBy:{
   createdAt:"desc"
  }
 });

 return posts.map(mapPost);
};

const likePost=async(userId,postId)=>{
 return prisma.like.upsert({
  where:{
   userId_postId:{
    userId,
    postId
   }
  },
  update:{},
  create:{
   userId,
   postId
  }
 });
};

const unlikePost=async(userId,postId)=>{
 return prisma.like.deleteMany({
  where:{
   userId,
   postId
  }
 });
};

const createComment=async(userId,postId,content)=>{
 if(!content?.trim()){
  throw new Error("Comment content is required");
 }

 return prisma.comment.create({
  data:{
   content:content.trim(),
   userId,
   postId
  },
  include:{
   author:{
    select:{
     id:true,
     username:true,
     firstName:true,
     lastName:true,
     profilePicture:true
    }
   }
  }
 });
};

const getComments=async(postId)=>{
 return prisma.comment.findMany({
  where:{postId},
  include:{
   author:{
    select:{
     id:true,
     username:true,
     firstName:true,
     lastName:true,
     profilePicture:true
    }
   }
  },
  orderBy:{
   createdAt:"asc"
  }
 });
};

const deleteComment=async(userId,commentId)=>{
 const comment=await prisma.comment.findUnique({
  where:{id:commentId}
 });

 if(!comment){
  throw new Error("Comment not found");
 }

 if(comment.userId!==userId){
  throw new Error("Unauthorized");
 }

 return prisma.comment.delete({
  where:{id:commentId}
 });
};

const deletePost=async(userId,postId)=>{
 const post=await prisma.post.findUnique({
  where:{id:postId}
 });

 if(!post){
  throw new Error("Post not found");
 }

 if(post.userId!==userId){
  throw new Error("Unauthorized");
 }

 return prisma.post.update({
  where:{id:postId},
  data:{isDeleted:true}
 });
};

const bookmarkPost=async(userId,postId)=>{
 return prisma.bookmark.upsert({
  where:{
   userId_postId:{
    userId,
    postId
   }
  },
  update:{},
  create:{
   userId,
   postId
  }
 });
};

const unbookmarkPost=async(userId,postId)=>{
 return prisma.bookmark.deleteMany({
  where:{
   userId,
   postId
  }
 });
};

const getBookmarkedPosts=async(userId)=>{
 const posts=await prisma.post.findMany({
  where:{
   isDeleted:false,
   bookmarks:{
    some:{userId}
   }
  },

  include: buildPostInclude(userId),

  orderBy:{
   createdAt:"desc"
  }
 });

 return posts.map(mapPost);
};

const repostPost = async (userId, postId) => {

  const originalPost = await prisma.post.findFirst({
    where: {
      id: postId,
      isDeleted: false
    }
  });

  if (!originalPost) {
    throw new Error("Post not found");
  }

  const existingRepost = await prisma.post.findFirst({
    where: {
      userId,
      repostOfId: postId,
      isDeleted: false
    }
  });

  if (existingRepost) {
    throw new Error("Already reposted");
  }

  return prisma.post.create({
    data: {
      userId,
      repostOfId: postId,
      content: ""
    }
  });
};

const sharePost = async (userId, postId) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      isDeleted: false
    },
    select: {
      id: true
    }
  });

  if (!post) {
    throw new Error("Post not found");
  }

  await prisma.share.create({
    data: {
      userId,
      postId
    }
  });

  return {
  url: `${process.env.CLIENT_URL}/post/${postId}`
  };
};

const getPostById = async (postId, userId) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      isDeleted: false
    },
    include: buildPostInclude(userId)
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return mapPost(post);
};

module.exports={
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
 getBookmarkedPosts,
 sharePost,
 getPostById,
 repostPost,
 getUserReposts
};
