import React, { Component } from "react";
import HGIcons from "../../components/hgIcons";
import { energyServicesIcons } from "../../util/energyServicesIcons";
import styles from "./index.module.css";

class EnergyService extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className={`${styles.pageContainer} ${styles.center}`}>
          <HGIcons icons={energyServicesIcons} />
        </div>
      </React.Fragment>
    );
  }
}

export default EnergyService;
