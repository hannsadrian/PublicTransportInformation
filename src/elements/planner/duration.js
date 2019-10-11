import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
var moment = require("moment");
require("moment-duration-format");

class Duration extends PureComponent {
  render() {
    return (
      <p>
        <FontAwesomeIcon icon={faClock} className="mr-3 h-4"></FontAwesomeIcon>
        <span className="my-auto">
          {this.props.duration < 60 ? (
            <>
              <span className="font-semibold">
                {moment.duration(this.props.duration, "minutes").format("m")}
              </span>
              <span className="text-gray-400">
                {moment.duration(this.props.duration, "minutes").format("m") ===
                "1"
                  ? " minute"
                  : " minutes"}
              </span>
            </>
          ) : (
            <>
              <span className="font-semibold">
                {moment.duration(this.props.duration, "minutes").format("h")}
              </span>
              <span className="text-gray-400">
                {moment.duration(this.props.duration, "minutes").format("h") ===
                "1"
                  ? " hour"
                  : " hours"}
              </span>
            </>
          )}
        </span>
      </p>
    );
  }
}

export default Duration;
