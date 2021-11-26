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
    //GET USER BY ID
    case "GET":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      var { id } = req.query;
      var user = await User.findById(id);

      if (!user) {
        res.status(404).send("User not found");
        return;
      }
      res.send(user);

      // res.json(user);
      break;

    //UPDATE USER
    case "PUT":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      var { id } = req.query;
      var user = await User.findById(id);
      if (!user) {
        res.status(404).send("User not found");
        return;
      }

      const { error } = validate(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }
      if (req.body.firstName) user.firstName = req.body.firstName;
      if (req.body.lastName) user.lastName = req.body.lastName;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      if (req.body.roles) user.roles = req.body.roles;
      if (req.body.jobIds) user.jobIds = req.body.jobIds;

      await User.findByIdAndUpdate(id, user, {
        new: true,
      });
      if (!user) return res.status(404).send("User not found");

      res.send(user);
      break;

    //DELETE USER BY ID
    case "DELETE":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      var { id } = req.query;
      const result = await User.findByIdAndRemove(id);
      if (!result) {
        res.status(404).send("User not found");
        return;
      }
      res.send(result);

      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};
