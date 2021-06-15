const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.bookSchema = Joi.object({
  book: Joi.object({
    title: Joi.string().required().escapeHTML(),
    sub: Joi.string().escapeHTML().allow(null, ""),
    publisher: Joi.string().escapeHTML().allow(null, ""),
    pubDate: Joi.date().allow(null, ""),
    author: Joi.string().required().escapeHTML().allow(null, ""),
    image: Joi.string().allow(null, ""),
    desc: Joi.string().allow(null, ""),
    bookLink: Joi.string().allow(null, ""),
    bookIsbn: Joi.string().allow(null, ""),
    genre: Joi.string().required(),
    pagecount: Joi.number().allow(null, ""),
  }).required(),
  deleteImages: Joi.array(),
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(-1).max(5),
  }).required(),
});
