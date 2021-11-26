const authentication = require("../../../util/middleware/authentication");
const authorisation = require("../../../util/middleware/authorisation");
const mongoose = require("mongoose");
const { Job, validate } = require("../../../models/job");
const _ = require("lodash");

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
    // GET JOB BY ID
    case "GET":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      var { id } = req.query;
      var singleJob = await Job.findById(id);
      if (!singleJob) {
        res.status(404).send("Job not found");
        return;
      }
      res.send(singleJob);

      break;

    case "DELETE":
      // Run the middleware
      await runMiddleware(req, res, authentication);
      await runMiddleware(req, res, authorisation("admin"));

      // Rest of the API logic
      var { id } = req.query;
      const deletedJob = await Job.findByIdAndRemove(id);
      if (!deletedJob) {
        res.status(404).send("Job not found");
        return;
      }
      res.send(deletedJob);

    default:
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Method ${req.method} not allowed`);
  }
};
