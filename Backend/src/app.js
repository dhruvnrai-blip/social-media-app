const testRoutes = require("./routes/testRoutes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const followRoutes=require("./routes/followRoutes");
const notificationRoutes=require("./routes/notificationRoutes");
const postRoutes=require("./routes/postRoutes");
const postLikesRoutes=require("./routes/postLikes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users",followRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/posts",postLikesRoutes);

app.get("/", (req, res) => {
  res.send("Social Media Backend Running");
});

module.exports = app;