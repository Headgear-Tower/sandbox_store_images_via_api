import React, { Component } from "react";
import Director from "../util/director";
import HumanInteraction from "./humanInteraction";
import MachineInteraction from "./machineInteraction";
import styles from "./actors.module.css";

class Stage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clapperboard: [],
      actionFlag: false,
      idsToRender: [],
      actorAction: false,
      transitionFlag: true,
    };

    this.script = this.props.script;
    this.director = new Director(
      this.setClapperboard,
      this.setActionFlag,
      this.setIdsToRender,
      this.getActorAction,
      this.handleRouting,
      this.script
    );
  }

  componentDidMount() {
    this.director.executeScript();
  }

  setClapperboard = (clapperboard) => {
    this.setState({ clapperboard });
  };

  setActionFlag = (actionFlag) => {
    this.setState({ actionFlag });
  };

  setIdsToRender = (idsToRender) => {
    return new Promise((resolve, reject) => {
      this.setState({ idsToRender }, () => {
        resolve(true);
      });
    });
  };

  handleRouting = (operation) => {
    console.log("handleRouting called");
    window.location = `${operation.content.path}`;
  };

  handleHumanAction = (data) => {
    // this.director.handleTriggerTypeUser(nextOpId);
    this.director.handleTriggerTypeUser(data);
    return data;
  };

  // handleHumanAction = (data) => {
  //   console.log(data);
  //   //this.director.handleTriggerTypeUser(nextOpId);
  //   //return nextOpId;
  // };

  render() {
    // Each of the divs below represent actors lines/actions on the stage
    return (
      <React.Fragment>
        <div>
          {this.state.clapperboard.length !== 0 &&
          this.state.clapperboard[0].type === "broadcast" &&
          this.state.actionFlag
            ? this.renderSingleBroadcast()
            : ""}
        </div>

        <div>
          {this.state.clapperboard.length !== 0 &&
          // this.state.idsToRender.length > 1 &&

          this.state.clapperboard[0].type === "interaction" &&
          this.state.clapperboard[0].subType === "question" &&
          this.state.actionFlag === true
            ? this.renderInteraction()
            : ""}
        </div>
      </React.Fragment>
    );
  }

  renderSingleBroadcast() {
    console.log("renderSingleBroadcast called");
    return (
      <React.Fragment>
        <div className={styles.actorContainer}>
          <div className={styles.typeBroadcast}>
            {this.state.clapperboard[0].content}
          </div>
        </div>
      </React.Fragment>
    );
  }
  getSchema(responseOp) {
    console.log(responseOp[0]);
    if (responseOp[0].subType === "response-input") {
      const schema = {
        propertyNumber: Joi.string()
          .min(1)
          .max(5)
          .required()
          .label(responseOp[0].content.label),
        postCode: Joi.string()
          .min(1)
          .max(8)
          .required()
          .label(responseOp[0].content.label),
      };

      if (responseOp[0].content.label === "propertyNumber") {
        return schema.propertyNumber;
      }
      if (responseOp[0].content.label === "postCode") {
        return schema.postCode;
      }
    }
  }
  renderInteraction() {
    //Render question and responses
    console.log("renderInteraction called");
    const operations = this.state.clapperboard;
    const [questionOp] = operations.filter((op) => op.subType === "question");
    const responseOp = operations.filter((op) => op.subType !== "question");

    console.log(questionOp);
    console.log(responseOp);
    return (
      <React.Fragment>
        <div className={styles.actorContainer}>
          <MachineInteraction label={questionOp.content.data} />
        </div>
        {/* <div className="actorContainer">
          {responseOp.map((op) => (
            <HumanInteraction
              key={op.Id}
              optionOp={op}
              onHumanActionTaken={this.handleHumanAction}
              // setIdsToRender={this.setIdsToRender}
            />
          ))}
        </div> */}
        <div className={styles.actorContainer}>
          {responseOp.map((op) => (
            <HumanInteraction
              key={op.Id}
              optionOp={op}
              questionOp={questionOp}
              // schema={this.getSchema(responseOp)}
              onHumanActionTaken={this.handleHumanAction}
              // setIdsToRender={this.setIdsToRender}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Stage;
