const Joi = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    minlength: 1,
    maxlength: 255,
  },
  dateCreated: {
    type: Date,
    required: [true, "Created date is required"],
  },
  dateUpdated: {
    type: Date,
    required: [true, "Updated date is required"],
  },
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    author: Joi.string(),
    content: Joi.string(),
    dateCreated: Joi.date().iso(),
    dateUpdated: Joi.date().iso(),
  });
  const result = schema.validate(post);

  return result;
}

exports.Post = Post;
exports.validatePost = validatePost;
