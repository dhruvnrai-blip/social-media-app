const express=require("express");
const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware");

const{
 create,
 feed,
 userPosts,
 comment,
 comments,
 removeComment,
 remove,
 like,
 unlike,
 bookmark,
 unbookmark
}=require("../controllers/postController");

router.post("/",authMiddleware,create);
router.get("/feed",authMiddleware,feed);
router.get("/user/:username",authMiddleware,userPosts);
router.post("/:postId/like",authMiddleware,like);
router.delete("/:postId/like",authMiddleware,unlike);
router.post("/:postId/bookmark",authMiddleware,bookmark);
router.delete("/:postId/bookmark",authMiddleware,unbookmark);
router.post("/:postId/comments",authMiddleware,comment);
router.get("/:postId/comments",authMiddleware,comments);
router.delete("/comments/:commentId",authMiddleware,removeComment);
router.delete("/:postId",authMiddleware,remove);

module.exports=router;
