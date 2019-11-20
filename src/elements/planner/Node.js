import React, { Component } from "react";

class Node extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageError: false
    };
  }

  render() {
    return (
      <div
        className={
          (this.props.node.mode !== undefined
            ? String(this.props.node.mode.name).includes("Footpath") ||
              String(this.props.node.mode.name).includes("StairsUp") ||
              String(this.props.node.mode.name).includes("StairsDown") ||
              String(this.props.node.mode.name).includes("EscalatorUp") ||
              String(this.props.node.mode.name).includes("EscalatorDown") ||
              String(this.props.node.mode.name).includes("ElevatorUp") ||
              String(this.props.node.mode.name).includes("ElevatorDown") ||
              String(this.props.node.mode.name).includes("Waiting") ||
              String(this.props.node.mode.name).includes("StayInVehicle")
              ? "bg-gray-300 text-gray-900"
              : "bg-gray-400 text-gray-800"
            : "bg-gray-400 text-gray-800") +
          " rounded-lg ml-1 mr-2 pl-3 pt-2 pb-2"
        }
      >
        <div className="flex justify-between">
          <div className="flex">
            <img
              style={
                this.state.imageError
                  ? { display: "hidden", marginRight: "0" }
                  : {
                      height: "24px"
                    }
              }
              id={this.props.node.line}
              className="my-2 mr-2 w-auto"
              src={
                typeof this.props.node.line === "string" &&
                this.props.node.line.includes("U") &&
                !this.props.node.mode
                  ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                  : this.props.node.mode.title.includes("taxi")
                  ? "https://www.dvb.de/assets/img/trans-icon/transport-alita.svg"
                  : this.props.node.mode.iconUrl
              }
              onError={() => {
                this.setState({ imageError: true });
              }}
            />
            <div className="w-40 leading-tight truncate my-auto text-sm">
              {this.props.node.line === "" ? (
                <span className="truncate mr-1">
                  {this.props.node.mode.title}
                </span>
              ) : (
                <span className="font-semibold truncate mr-1">
                  {this.props.node.line}
                </span>
              )}
              <span className="truncate">
                {this.props.node.direction !== "" ? (
                  <>
                    <br></br> {this.props.node.direction}
                  </>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
          <p className="my-auto whitespace-no-wrap text-right mr-4">
            {this.props.node.duration} min
          </p>
        </div>
      </div>
    );
  }
}

export default Node;
