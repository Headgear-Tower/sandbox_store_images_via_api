import React, { Component } from "react";
import Form from "./form";
import styles from "./actors.module.css";

class MachineInteraction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <form>
          <div className={styles.machineInteraction}>{this.props.label}</div>
        </form>
      </React.Fragment>
    );
  }
}

export default MachineInteraction;
