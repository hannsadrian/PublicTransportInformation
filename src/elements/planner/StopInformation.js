import React, { Component } from "react";

class StopInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <p className="leading-snug font-semibold truncate mt-2">
        <span className="text-xl">
          {this.props.information.name + ", " + this.props.information.city}
        </span>{" "}
        <br></br>
        <span className="text-gray-700 font-semibold text-base">
          {String(this.props.information.time.getHours()).padStart(2, "0") +
            ":" +
            String(this.props.information.time.getMinutes()).padStart(2, "0") +
            " " +
            String(this.props.information.time.getDate()).padStart(2, "0") +
            "." +
            String(this.props.information.time.getMonth() + 1).padStart(
              2,
              "0"
            ) +
            "." +
            String(this.props.information.time.getFullYear())}

          {this.props.information.platform !== undefined ? (
            <>
              <span className="tracking-wide">
                {" | " +
                  this.props.information.platform.type +
                  " " +
                  this.props.information.platform.name}
              </span>
            </>
          ) : (
            <></>
          )}
        </span>
      </p>
    );
  }
}

export default StopInformation;
