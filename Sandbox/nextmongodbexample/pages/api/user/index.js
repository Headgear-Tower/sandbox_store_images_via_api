const authentication = require("../../../util/middleware/authentication");
const authorisation = require("../../../util/middleware/authorisation");
const { User, validate } = require("../../../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");

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
    //GET ALL USERS
    case "GET":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      var allUsers = await User.find({});
      res.send(allUsers);
      break;

    // POST NEW USER
    case "POST":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      const { error } = validate(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      var user = await User.findOne({ email: req.body.email });
      if (user) {
        res.status(400).send(" Email is already registered.");
        return;
      }

      user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        roles: req.body.roles,
        jobIds: req.body.jobIds,
        dateCreated: new Date(),
        dateUpdated: new Date(),
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();

      const result = _.pick(user, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "roles",
        "jobIds",
        "dateCreated",
        "dateUpdated",
      ]); // Pick out only the defined properties

      const token = user.generateAuthToken();
      res.setHeader("x-auth-token", token); // Set response header
      res.send(result);

      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};
