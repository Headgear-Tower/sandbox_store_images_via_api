import { User } from "../../../models/user";

const authentication = require("../../../util/middleware/authentication");
const authorisation = require("../../../util/middleware/authorisation");
const { Job, validateJob } = require("../../../models/job");
const mongoose = require("mongoose");
// const { User, validate } = require("../../../models/user");
//const bcrypt = require("bcrypt");
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
    //GET JOB SUMMARY
    case "GET":
      // Run the middleware (none)

      // Rest of the API logic
      const jobDetails = await Job.findOne({
        propertyNumber: req.query.propertyNumber,
        postCode: req.query.postCode,
      });
      // Authenticate
      const userId = jobDetails.userId;
      const userDetails = await User.findById(userId);

      const jobSummary = _.pick(jobDetails, [
        "summary",
        "firstName",
        "secondName",
        "_id",
        // "userId",
      ]); // Pick out only the defined properties

      if (!jobSummary) {
        res.status(404).send("Job not found");
        return;
      }

      jobSummary.token = userDetails.token;
      res.send(jobSummary);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};
