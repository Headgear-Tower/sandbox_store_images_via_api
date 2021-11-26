import React, { Component } from "react";
import Form from "./form";
import styles from "./actors.module.css";
import Joi from "joi-browser";

class HumanInteraction extends Form {
  //propertyNumber = React.createRef(); //Create a ref object
  //postCode = React.createRef(); //Create a ref object
  schema = {
    [this.props.optionOp.content.label]: Joi.string()
      .required()
      .min(1)
      .max(8)
      .label(this.parseCamelCase(this.props.optionOp.content.label)),
  };

  constructor(props) {
    super(props);
    this.state = { data: {}, errors: {} };
  }

  parseCamelCase(camelCase) {
    console.log(camelCase);
    return camelCase.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  doResponseSelect = () => {
    const data = {
      nextOpId: this.props.optionOp.nextOpId,
      data: this.props.optionOp.content.data,
      label: this.props.questionOp.content.label,
      type: this.props.optionOp.subSubType,
    };
    this.props.onHumanActionTaken(data);
  };

  doSubmit = async () => {
    const { data } = this.state;
    this.props.onHumanActionTaken(data);
    // CODE REVIEW  change the above to pass the data to stage opposed to jsut next op id. change to object?
  };

  render() {
    return (
      <React.Fragment>
        {this.props.optionOp.subType === "response-select" &&
          this.renderResponseSelect()}
        {this.props.optionOp.subType === "response-input" &&
          this.renderResponseInput()}
      </React.Fragment>
    );
  }

  renderResponseSelect() {
    // CODE REVIEW - Change to a form like response-input
    return (
      <React.Fragment>
        <div>
          {this.props.optionOp.subType === "response-select" ? (
            <button
              className={styles.humanInteraction}
              onClick={this.doResponseSelect}
            >
              {this.props.optionOp.content.label}
            </button>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }

  renderResponseSelectTest() {
    return (
      <React.Fragment>
        <div className={styles.humanInteraction}>
          <form onSubmit={this.handleSubmit}>
            <button
              onClick={console.log(this.props.optionOp.content.label)}
            ></button>
          </form>
        </div>
      </React.Fragment>
    );
  }

  renderResponseInput() {
    return (
      <React.Fragment>
        <div className={styles.humanInteraction}>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput(this.props.optionOp.content.label)}

            <div
              style={{
                display: "flex",
                margin: "1rem",
                justifyContent: "center",
              }}
            >
              {this.renderButton("Submit")}
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default HumanInteraction;
