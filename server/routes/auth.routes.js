const router = require("express").Router();
const {
  register,
  login,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");
const passport = require("passport");
const { parser } = require("../utils/cloudinary");
const User = require("../models/user.model");

router.post("/register", parser.single("avatar"), register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyResetPasswordToken);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const jwt = require("jsonwebtoken");
    try {
      const user = req.user;
      if (!user) {
        return res.redirect(
          `${
            process.env.CLIENT_URL || "http://localhost:3000"
          }/login?error=auth_failed`
        );
      }

      const accessToken = jwt.sign(
        { userId: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_KEY,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "30d" }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/home`);
    } catch (error) {
      console.error("Error in Google OAuth callback:", error.message);
      res.redirect(
        `${
          process.env.CLIENT_URL || "http://localhost:3000"
        }/login?error=auth_failed`
      );
    }
  }
);

module.exports = router;
