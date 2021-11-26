const authentication = require("../../../util/middleware/authentication");
const authorisation = require("../../../util/middleware/authorisation");
const mongoose = require("mongoose");
const { User, validate } = require("../../../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");

//import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";
//const { User, validate } = require("../../../models/user");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    //console.log(req.header);
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req, res) => {
  switch (req.method) {
    //GET CURRENT USER
    case "GET":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("user"));

      // Rest of the API logic
      var user = await User.findById(req.user._id).select("-password"); // Comes from the users JWT. Exclude password property

      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      res.json(user);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};
