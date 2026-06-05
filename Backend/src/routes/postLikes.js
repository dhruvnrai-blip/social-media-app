const express=require("express");
const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware");

const{
 like,
 unlike
}=require("../controllers/postController");

router.post("/:postId/like",authMiddleware,like);
router.delete("/:postId/like",authMiddleware,unlike);

module.exports=router;