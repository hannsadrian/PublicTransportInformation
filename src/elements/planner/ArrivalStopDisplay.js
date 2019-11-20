import React, { Component } from "react";

class ArrivalStopDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <>
        {(this.props.index === this.props.trip.nodes.length - 1 ||
          this.props.index !== this.props.trip.nodes.length - 1) &&
        this.props.node.arrival !== undefined ? (
          <h3 className="text-gray-800 truncate mt-2 mb-2">
            <span
              className="font-semibold lg:hover:underline lg:cursor-pointer"
              onClick={this.props.onClick}
              id={this.props.node.arrival.id}
            >
              {this.props.node.arrival.name +
                ", " +
                this.props.node.arrival.city}
            </span>
            {this.props.node.stops.length > 0 ? (
              <p className="tracking-wide text-gray-700 font-semibold text-sm -mt-1">
                an{" "}
                {String(this.props.node.arrival.time.getHours()).padStart(
                  2,
                  "0"
                ) +
                  ":" +
                  String(this.props.node.arrival.time.getMinutes()).padStart(
                    2,
                    "0"
                  ) +
                  String(
                    this.props.node.stops[this.props.node.stops.length - 1]
                      .platform !== undefined
                      ? " | " +
                          this.props.node.stops[
                            this.props.node.stops.length - 1
                          ].platform.type +
                          " " +
                          this.props.node.stops[
                            this.props.node.stops.length - 1
                          ].platform.name
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

export default ArrivalStopDisplay;
