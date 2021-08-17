import React, { Component } from "react";
import "./chat.css";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <div class="chatApp"></div>

        <div class="chatPanel"></div>

        <div class="messageRight">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum aut
          eum assumenda vero illum temporibus! Minima cupiditate architecto
          perspiciatis esse soluta optio quis non obcaecati a, totam recusandae,
          unde rem illo quasi, sint odio quo? Expedita, quasi. Minima facilis
          nesciunt rem explicabo est. Voluptatibus doloremque architecto nihil?
          Iure, eius aspernatur.
        </div>
        <div class="messageLeft">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum aut
          eum assumenda vero illum temporibus! Minima cupiditate architecto
          perspiciatis esse soluta optio quis non obcaecati a, totam recusandae,
          unde rem illo quasi, sint odio quo? Expedita, quasi. Minima facilis
          nesciunt rem explicabo est. Voluptatibus doloremque architecto nihil?
          Iure, eius aspernatur.
        </div>
      </React.Fragment>
    );
  }
}

export default Chat;
