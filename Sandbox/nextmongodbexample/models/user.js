const Joi = require("joi");
const mongoose = require("mongoose");
const PasswordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const complexityOptions = {
  min: 5,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 6,
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: 2,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 5,
    maxlength: 1024,
  },
  token: {
    type: String,
    required: [true, "Token is required"],
    minlength: 5,
    maxlength: 1024,
  },

  roles: {
    type: [String],
    required: [true, "Roles are required"],
  },
  jobIds: {
    type: [String],
    required: [true, "Job IDs are required"],
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

userSchema.methods.generateAuthToken = function () {
  console.log("gen auth called");
  // Add a method to the userSchema object

  const token = jwt.sign(
    {
      _id: this._id,
      roles: this.roles,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      jobIds: this.job_ids,
      dateCreated: this.dateCreated,
      dateUpdated: this.dateUpdated,
    },
    // config.get("jwtPrivateKey")
    process.env.JWT_PRIVATE_KEY
    //"gtGasJwtPrivateKey" //// CODE REVIEW - Change to config variable
  ); //1st arg is the payload, 2nd arg is the name of the key used to create the digital sig - got from the config.json file
  return token;
};

try {
  // Trying to get the existing model to avoid OverwriteModelError
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", userSchema);
}
function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(), //.required(),
    password: PasswordComplexity(complexityOptions), //.required(),
    roles: Joi.array(), //.required(),
    jobIds: Joi.array(),
    token: Join.string(),
    dateCreated: Joi.date().iso(),
    dateUpdated: Joi.date().iso(),
  });
  const result = schema.validate(user);
  return result;
}

exports.User = User;
exports.validate = validateUser;
