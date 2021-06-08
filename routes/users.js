const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const users = require("../controllers/users");

// Prefixed with '/'

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlas: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
