import React, { Component } from "react";

import Router from "next/router";




class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.timerRef = null;
  }



  componentWillUnmount() {
    clearTimeout(this.timerRef);
  }

  render() {
    return (
      <React.Fragment>
 
<form method="POST" action="/api/upload" enctype="multipart/form-data">
    <div>
        <label>Select your profile picture:</label>
        <input type="file" name="profile_pic" />
    </div>
    <div>
        <input type="submit" name="btn_upload_profile_pic" value="Upload" />
    </div>
</form>


<form method="POST" action="/upload-multiple-images" enctype="multipart/form-data">
    <div>
        <label>Select multiple images:</label>
        <input type="file" name="multiple_images" multiple />
    </div>
    <div>
        <input type="submit" name="btn_upload_multiple_images" value="Upload" />
    </div>
</form>
      </React.Fragment>
    );
  }
}

export default Upload;





// require("dotenv").config();
// const upload = require("./api/upload");
// const Grid = require("gridfs-stream");
// const mongoose = require("mongoose");
// const connection = require("./db");
// const express = require("express");
// const app = express();

// let gfs;
// connection();

// const conn = mongoose.connection;
// conn.once("open", function () {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("photos");
// });

// app.use("/file", upload);

// // media routes

// app.get("/test", async (req, res) => {
//   console.log("called here")
//   return res.send("working");
// });
// app.get("/file/:filename", async (req, res) => {
//     try {
//         const file = await gfs.files.findOne({ filename: req.params.filename });
//         const readStream = gfs.createReadStream(file.filename);
//         readStream.pipe(res);
//     } catch (error) {
//         res.send("not found");
//     }
// });

// app.delete("/file/:filename", async (req, res) => {
//     try {
//         await gfs.files.deleteOne({ filename: req.params.filename });
//         res.send("success");
//     } catch (error) {
//         console.log(error);
//         res.send("An error occured.");
//     }
// });

// const port = process.env.PORT || 8080;
// app.listen(port, console.log(`Listening on port ${port}...`));