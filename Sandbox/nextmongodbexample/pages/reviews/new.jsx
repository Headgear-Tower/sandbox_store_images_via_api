import React, { Component } from "react";
import Stage from "../../components/stage";
import script from "../../util/scriptNewReview";

class PageNewReview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <h1>Leave Review</h1>

        <Stage script={script} />
      </React.Fragment>
    );
  }
}

export default PageNewReview;
