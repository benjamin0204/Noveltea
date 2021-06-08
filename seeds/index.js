const mongoose = require("mongoose");
const citites = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Databse connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100);
    const camp = new Campground({
      author: "60bce8b893901544b07f43df",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dln90qkqe/image/upload/v1623015075/YelpCamp/ym5dfss566er3gf0dvzj.jpg",
          filename: "YelpCamp/ym5dfss566er3gf0dvzj",
        },
        {
          url: "https://res.cloudinary.com/dln90qkqe/image/upload/v1623015075/YelpCamp/nyuqb8blvbwakokbxrrq.jpg",
          filename: "YelpCamp/nyuqb8blvbwakokbxrrq",
        },
        {
          url: "https://res.cloudinary.com/dln90qkqe/image/upload/v1623015077/YelpCamp/ixgqmxhmflmrprfx7qhq.jpg",
          filename: "YelpCamp/ixgqmxhmflmrprfx7qhq",
        },
        {
          url: "https://res.cloudinary.com/dln90qkqe/image/upload/v1623015080/YelpCamp/zsenrcso4a5aenef6zpr.jpg",
          filename: "YelpCamp/zsenrcso4a5aenef6zpr",
        },
      ],
      desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam impedit at eos in, deleniti nostrum accusamus porro exercitationem possimus quam, ipsa amet, praesentium consectetur dolores rem harum magnam distinctio vitae!",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
