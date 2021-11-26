const _ = require("lodash");
import { connectToDatabase } from "../../util/mongodb";
const { User } = require("../../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// // CODE REVIEW - Change to get from config file
// //process.env.JWT_PRIVATE_KEY
// process.env.DB_CONNECTION_STRING
// const connectionString =
//   "mongodb+srv://donheadgear:starboard10!@cluster0.jrjzw.mongodb.net/gTGas?retryWrites=true&w=majority";
// mongoose
//   .connect(connectionString)
//   .then(() => console.log("Connected to MongoDB..."))
//   .catch((err) => console.error("Could not connect to MongoDB...", err));

// CODE REVIEW - Change to get from config file
//process.env.JWT_PRIVATE_KEY

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(400).send(" Invalid email or password.");
        return;
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      ); // Compare req password with user password - returns bool
      if (!validPassword) {
        res.status(400).send(" Invalid email or password.");
        return;
      }
      const token = user.generateAuthToken();
      user["token"] = token;
      console.log(user);
      await User.findByIdAndUpdate(user._id, user, {
        new: true,
      });

      res.setHeader("x-auth-token", token);
      res.status(200).send(token);
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });
  const result = schema.validate(req);
  return result;
}
