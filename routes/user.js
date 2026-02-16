const express = require("express");
const router = express.Router();
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

// ==============================
// SIGNUP ROUTES
// ==============================
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);

// ==============================
// LOGIN ROUTES
// ==============================
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// ==============================
// LOGOUT ROUTE
// ==============================

// ✅ Logout should ideally be POST
router.post("/logout", userController.logout);

module.exports = router;
