import React, { Component } from "react";
import "./sandbox.css";

class Sandbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    // this.styling = {
    //   padding: "10px 20px 10px 20px",
    //   border: "5px solid gold",
    //   margin: "10px 50px 10px 50px",
    //   width: "100px",
    //   height: "100px",
    //   background: "grey",
    // };
  }
  render() {
    return (
      <React.Fragment>
        <div class="box"> Hello</div>
      </React.Fragment>
    );
  }
}

export default Sandbox;
