import React, { Component } from "react";
import styles from "./hgIcons.module.css";

class HGIcons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icons: [],
    };
  }

  componentDidMount() {
    this.setState({ icons: this.props.icons }, () => {});
  }
  render() {
    return (
      <div className="d-flex">
        {this.state.icons.map((icon) => (
          <a
            className={styles.icon}
            key={icon.title}
            href={`/energy-services${icon.link}`}
          >
            {icon.title}
          </a>
        ))}
      </div>
    );
  }
}

export default HGIcons;
