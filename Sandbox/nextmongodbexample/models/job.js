const Joi = require("joi");
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  propertyNumber: {
    type: String,
    required: [true, "Property number is required"],
  },
  postCode: {
    type: String,
    required: [true, "Post code is required"],
  },
  summary: {
    type: String,
    required: [true, "Content is required"],
    minlength: 1,
    maxlength: 255,
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: 1,
    maxlength: 255,
  },
  secondName: {
    type: String,
    required: [true, "Second name is required"],
    minlength: 1,
    maxlength: 255,
  },

  feedback: {},

  userId: { type: String },

  dateCreated: {
    type: Date,
    required: [true, "Created date is required"],
  },
  dateUpdated: {
    type: Date,
    required: [true, "Updated date is required"],
  },
});

try {
  // Trying to get the existing model to avoid OverwriteModelError
  Job = mongoose.model("Job");
} catch {
  Job = mongoose.model("Job", jobSchema);
}

function validateJob(job) {
  const schema = Joi.object({
    propertyNumber: Joi.string(),
    postCode: Joi.string(),
    summary: Joi.string(),
    firstName: Joi.string(),
    secondName: Joi.string(),
    feedback: Joi.object(),
    userId: Joi.string(),
    dateCreated: Joi.date().iso(),
    dateUpdated: Joi.date().iso(),
  });
  const result = schema.validate(job);

  return result;
}

function validateFeedback(feedback) {
  const schema = Joi.object({
    installationTeamRating: Joi.string(),
    valueForMoney: Joi.string(),
    standardOfWork: Joi.string(),
    additionalComments: Joi.string(),
  });
  const result = schema.validate(feedback);

  return result;
}

exports.Job = Job;
exports.validateJob = validateJob;
exports.validateFeedback = validateFeedback;
