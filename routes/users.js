const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const users = require("../controllers/users");

// Prefixed with '/'

// register login
router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.registerUser));

// login user
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

// logout user
router.get("/logout", isLoggedIn, users.logoutUser);

// Show all users
router.route("/user/").get(catchAsync(users.renderShowUsersPage));

// Show single users
router.route("/user/:id").get(catchAsync(users.renderShowSingleUserPage));
// edit user
router
  .route("/user/edit/:id")
  .get(catchAsync(users.renderEditUserPage))
  .put(isLoggedIn, catchAsync(users.editUser));

module.exports = router;
