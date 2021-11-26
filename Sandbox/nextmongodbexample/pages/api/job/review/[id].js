const authentication = require("../../../../util/middleware/authentication");
const authorisation = require("../../../../util/middleware/authorisation");
const { Job, validateFeedback } = require("../../../../models/job");
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
    case "POST": // NEW REVIEW
      console.log("called");
      //Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("customer"));

      //Rest of the API logic
      var { id } = req.query;
      const job = await Job.findById(id);
      if (!job) {
        res.status(404).send("Job not found");
        return;
      }

      const { error } = validateFeedback(req.body); // update to validate feedback
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      for (var key in req.body) {
        if (job.feedback) {
          job.feedback[key] = req.body[key];
          job.dateUpdated = new Date();
          await Job.findByIdAndUpdate(id, job, {
            new: true,
          });
        }

        if (!job.feedback) {
          var feedback = {};
          feedback[key] = req.body[key];
          job.feedback = feedback;
          job.dateUpdated = new Date();
          await Job.findByIdAndUpdate(id, job, {
            new: true,
          });
        }
      }

      if (!job) return res.status(404).send("Job not found");

      res.send(job.feedback);

      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};
