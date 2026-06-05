const router=require("express").Router();
const authMiddleware=require("../middleware/authMiddleware");
const{follow,unfollow,acceptRequest,rejectRequest,pendingRequests,followers,following,followStatus}=require("../controllers/followController");

router.post("/follow/:username",authMiddleware,follow);
router.delete("/unfollow/:username",authMiddleware,unfollow);
router.post("/requests/:requestId/accept",authMiddleware,acceptRequest);
router.post("/requests/:requestId/reject",authMiddleware,rejectRequest);
router.get("/follow-requests",authMiddleware,pendingRequests);
router.get("/followers/:username",followers);
router.get("/following/:username",following);
router.get("/follow-status/:username",authMiddleware,followStatus);

module.exports=router;