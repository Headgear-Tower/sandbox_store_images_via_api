import { useState } from "react";

/**
 * # MY ACCOUNT GOOGLE PLAY:
 * @see {@link https://play.google.com/store/apps/developer?id=dzino Google Play}
 */

export default function PrivatePage(props) {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", image);
    console.log(body)
    const response = await fetch("/api/upload", {
      method: "POST",
      body
    });
  };

  return (
    <div>
      <div>
        <img src={createObjectURL} />
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button>
      </div>
    </div>
  );
}


// import React, { Component } from "react";

// import Router from "next/router";
// import Upload from "../components/upload";
// //const multer = require('multer')
// const helpers = require ("./helpers")


// class LandingPage extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {};
//     this.timerRef = null;
//   }

// //   storage = multer.diskStorage({
// //     destination: function(req, file, cb) {
// //         cb(null, 'uploads/');
// //     },

// //     // By default, multer removes file extensions so let's add them back
// //     filename: function(req, file, cb) {
// //         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
// //     }
// // });




//   render() {
//     return (
//       <React.Fragment>
 
// <Upload/>
//       </React.Fragment>
//     );
//   }
// }

// export default LandingPage;





// // require("dotenv").config();
// // const upload = require("./api/upload");
// // const Grid = require("gridfs-stream");
// // const mongoose = require("mongoose");
// // const connection = require("./db");
// // const express = require("express");
// // const app = express();

// // let gfs;
// // connection();

// // const conn = mongoose.connection;
// // conn.once("open", function () {
// //     gfs = Grid(conn.db, mongoose.mongo);
// //     gfs.collection("photos");
// // });

// // app.use("/file", upload);

// // // media routes

// // app.get("/test", async (req, res) => {
// //   console.log("called here")
// //   return res.send("working");
// // });
// // app.get("/file/:filename", async (req, res) => {
// //     try {
// //         const file = await gfs.files.findOne({ filename: req.params.filename });
// //         const readStream = gfs.createReadStream(file.filename);
// //         readStream.pipe(res);
// //     } catch (error) {
// //         res.send("not found");
// //     }
// // });

// // app.delete("/file/:filename", async (req, res) => {
// //     try {
// //         await gfs.files.deleteOne({ filename: req.params.filename });
// //         res.send("success");
// //     } catch (error) {
// //         console.log(error);
// //         res.send("An error occured.");
// //     }
// // });

// // const port = process.env.PORT || 8080;
// // app.listen(port, console.log(`Listening on port ${port}...`));