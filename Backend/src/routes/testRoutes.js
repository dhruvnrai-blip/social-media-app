const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/db-test", async (req, res) => {
  try {

    const users = await prisma.user.findMany();

    res.json({
      success: true,
      users
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });

  }
});

module.exports = router;
