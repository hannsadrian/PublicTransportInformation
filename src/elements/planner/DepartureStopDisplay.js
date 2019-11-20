import React, { Component } from "react";

class DepartureStopDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <>
        {this.props.node.departure !== undefined ? (
          <h3 className="text-gray-800 truncate mb-2 mt-2">
            <span
              className="font-semibold lg:hover:underline lg:cursor-pointer"
              onClick={this.props.onClick}
              id={this.props.node.departure.id}
            >
              {this.props.node.departure.name +
                ", " +
                this.props.node.departure.city}
            </span>
            {this.props.node.stops.length > 0 ? (
              <p className="tracking-wide text-gray-700 font-semibold text-sm -mt-1">
                ab{" "}
                {String(this.props.node.departure.time.getHours()).padStart(
                  2,
                  "0"
                ) +
                  ":" +
                  String(this.props.node.departure.time.getMinutes()).padStart(
                    2,
                    "0"
                  ) +
                  String(
                    this.props.node.stops[0].platform !== undefined
                      ? " | " +
                          this.props.node.stops[0].platform.type +
                          " " +
                          this.props.node.stops[0].platform.name
                      : ""
                  )}
              </p>
            ) : (
              <></>
            )}
          </h3>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default DepartureStopDisplay;
