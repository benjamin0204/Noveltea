const multer = require("multer");

const User = require("../models/user");
const { cloudinary } = require("../cloudinary");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });

    user.image.url = req.file.path;
    user.image.filename = req.file.filename;

    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to NovelTea");
      res.redirect("/books");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  console.log("LOGIN CONTROLLER");
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/books";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/books");
};

module.exports.renderEditUserPage = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("users/edit", { user });
};

module.exports.editUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, {
    ...req.body.book,
  });
  await user.save();
  req.flash("success", "Successfully made an update");
  res.redirect(`/`);
};

module.exports.renderShowUsersPage = async (req, res) => {
  const users = await User.find({});
  res.render("users/index", { users });
};

module.exports.renderShowSingleUserPage = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("users/show", { user });
};
