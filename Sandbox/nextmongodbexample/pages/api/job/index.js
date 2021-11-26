const authentication = require("../../../util/middleware/authentication");
const authorisation = require("../../../util/middleware/authorisation");
const { Job, validateJob } = require("../../../models/job");
const mongoose = require("mongoose");
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
    case "GET": // ALL JOBS
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      var allJobs = await Job.find({});
      res.send(allJobs);
      break;

    case "POST": // NEW JOB
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      const { error } = validateJob(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      let job = await Job.findOne({
        propertyNumber: req.body.propertyNumber,
        postCode: req.body.postCode,
      });
      if (job) {
        res.status(400).send(" Job already exists.");
        return;
      }

      job = new Job({
        propertyNumber: req.body.propertyNumber,
        postCode: req.body.postCode,
        summary: req.body.summary,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        feedback: req.body.feedback,
        userId: req.body.userId,
        dateCreated: new Date(),
        dateUpdated: new Date(),
      });

      await job.save();
      const result = _.pick(job, [
        "_id",
        "propertyNumber",
        "postCode",
        "summary",
        "firstName",
        "secondName",
        "feedback",
        "userId",
        "dateCreated",
        "dateUpdated",
      ]); // Pick out only the defined properties

      res.send(result);

      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};
