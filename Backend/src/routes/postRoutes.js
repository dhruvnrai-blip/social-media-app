const express=require("express");
const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware");

const{
 create,
 feed,
 userPosts,
 userReposts,
 comment,
 comments,
 removeComment,
 remove,
 like,
 unlike,
 bookmark,
 unbookmark,
 bookmarkedPosts,
 share,
 getPost,
 repost
}=require("../controllers/postController");

router.post("/",authMiddleware,create);
router.get("/feed",authMiddleware,feed);
router.get("/bookmarks",authMiddleware,bookmarkedPosts);
router.get("/user/:username",authMiddleware,userPosts);
router.get("/user/:username/reposts",authMiddleware,userReposts);
router.post("/:postId/like",authMiddleware,like);
router.delete("/:postId/like",authMiddleware,unlike);
router.post("/:postId/bookmark",authMiddleware,bookmark);
router.delete("/:postId/bookmark",authMiddleware,unbookmark);
router.post("/:postId/share",authMiddleware,share);
router.get("/:postId",authMiddleware,getPost);
router.post("/:postId/repost",authMiddleware,repost);
router.post("/:postId/comments",authMiddleware,comment);
router.get("/:postId/comments",authMiddleware,comments);
router.delete("/comments/:commentId",authMiddleware,removeComment);
router.delete("/:postId",authMiddleware,remove);

module.exports=router;
