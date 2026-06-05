const router=require("express").Router();
const authMiddleware=require("../middleware/authMiddleware");
const{notifications,readNotification}=require("../controllers/notificationController");

router.get("/",authMiddleware,notifications);
router.patch("/:notificationId/read",authMiddleware,readNotification);

module.exports=router;