const express = require("express");
const {signup, login, forgotPasswordController, resetPasswordController, verifyEmailController, refresh} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.get("/verify-email/:token", verifyEmailController);
router.post("/refresh",refresh);

module.exports = router;