if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrat = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const MongoStore = require("connect-mongo");

// utils
const ExpressError = require("./utils/ExpressError");

// models
const User = require("./models/user");

// routes
const bookRoutes = require("./routes/books");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const feedRoutes = require("./routes/feed");

// Mongo connection
const mongoose = require("mongoose");
// const dbUrl = process.env.MONGO_URL;
const dbURL =
  "mongodb+srv://Admin:9weEEUkQ42vNCwLu@cluster0.tdquf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Databse connected");
});

const app = express();

// ejs set up
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Method override set up
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set up static serving directory
app.use(express.static(path.join(__dirname, "/public")));

// Sanitising
app.use(mongoSanitize());

const secret = process.env.SECRET || "cODyTHeDOg";
const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

// Flash setup
app.use(flash());

// helmet

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://api.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js",
  "https://peaceful-thicket-75498.herokuapp.com/Styles/home.css",
  "https://code.jquery.com/jquery-3.6.0.min.js ",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css",
  "https://api.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.css",
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
  "https://www.googleapis.com",
  "http://books.google.com/books/content",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dln90qkqe/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com",
        "http://books.google.com/books/content",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// passport setup - must be after session setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting 'global' vars
app.use((req, res, next) => {
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Using routes
app.use("/", userRoutes);
app.use("/feed", feedRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/reviews", reviewRoutes);

// Landing page
app.get("/", (req, res) => {
  res.render("landing");
});

// 404 page
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Next - error handling
app.use((err, req, res, next) => {
  const { statusCode = "500" } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port: ${port} `);
});
