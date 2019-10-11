import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

class Interchanges extends Component {
  render() {
    return (
      <p>
        <FontAwesomeIcon
          icon={faExchangeAlt}
          className="mr-3 h-4"
        ></FontAwesomeIcon>
        <span className="my-auto">
          <span className="font-semibold">{this.props.interchanges}</span>{" "}
          <span className="text-gray-400">
            {this.props.interchanges === 1 ? "interchange" : "interchanges"}
          </span>
        </span>
      </p>
    );
  }
}

export default Interchanges;
