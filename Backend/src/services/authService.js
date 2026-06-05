const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const prisma = require("../config/prisma");
const {generateAccessToken, generateRefreshToken} = require("../utils/tokenUtils");
const signupUser = async ({
  username,
  email,
  password
}) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });
  if (existingUser) {
    throw new Error(
      "Email or username already exists"
    );
  }
  const hashedPassword =
    await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      isVerified: false
    }
  });
  await sendVerificationEmail(user);
  return {
    message:
        "Registration successful. Please verify your email before logging in."
};
};
const loginUser = async ({
  email,
  password
}) => {
  const user =
    await prisma.user.findUnique({
      where: { email }
    });
  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }
  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    );
  if (!passwordMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }
  if (!user.isVerified) {
    throw new Error(
        "Please verify your email before logging in."
    );
  }
  const accessToken =
    generateAccessToken(user.id);
  const refreshToken =
    generateRefreshToken(user.id);
  const { password: _, ...safeUser } = user;
  return {
    user: safeUser,
    accessToken,
    refreshToken
  };
};
const forgotPassword = async (email) => {
  const user =
    await prisma.user.findUnique({
      where: { email }
    });
  if (!user) {
    throw new Error(
      "User not found"
    );
  }
  const resetToken =
    crypto.randomBytes(32)
      .toString("hex");
  const expiry =
    new Date(
      Date.now() +
      15 * 60 * 1000
    );
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry:
        expiry
    }
  });
  const resetLink =
    `${process.env.CLIENT_URL}` +
    `/reset-password/${resetToken}`;
  await sendEmail(
    user.email,
    "Password Reset",
    `Reset your password:\n${resetLink}`
  );
  return {
    message:
      "Reset email sent"
  };
};
const resetPassword =
  async (token, newPassword) => {
    const user =
      await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date()
          }
        }
      });
    if (!user) {
      throw new Error(
        "Invalid or expired token"
      );
    }
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password:
          hashedPassword,
        resetToken: null,
        resetTokenExpiry:
          null
      }
    });
    return {
      message:
        "Password reset successful"
    };
};
const sendVerificationEmail = async (user) => {
    const verificationToken =
        crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            verificationToken: verificationToken
        }
    });
    const verificationLink =
        `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail(
        user.email,
        "Email Verification",
        `Verify your account:\n${verificationLink}`
    );
    return {
        success: true
    };
};
const verifyEmail = async (token) => {
    const user = await prisma.user.findFirst({
        where: {
            verificationToken: token
        }
    });
    if (!user) {
        throw new Error("Invalid verification token");
    }
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            isVerified: true,
            verificationToken: null
        }
    });
    return {
        message: "Email verified successfully"
    };
};

const jwt=require("jsonwebtoken");

const refreshAccessToken=async(refreshToken)=>{
if(!refreshToken) throw new Error("Refresh token missing");

const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);

const accessToken=generateAccessToken(decoded.userId);

return{accessToken};
};

module.exports = {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  refreshAccessToken
};