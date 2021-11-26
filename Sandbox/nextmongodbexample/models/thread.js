const Joi = require("joi");
const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  threadID: {
    type: String,
    required: [true, "First name is required"],
    minlength: 7,
    maxlength: 12,
  },
  posts: {
    type: [JSON],
    required: [true, "Posts are required"],
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

const Thread = mongoose.model("Thread", threadSchema);

function validateThread(thread) {
  const schema = Joi.object({
    threadID: Joi.string(),
    posts: Joi.array(), //.required(),
    dateCreated: Joi.date().iso(),
    dateUpdated: Joi.date().iso(),
  });
  const result = schema.validate(thread);

  return result;
}

exports.Thread = Thread;
exports.validateThread = validateThread;
