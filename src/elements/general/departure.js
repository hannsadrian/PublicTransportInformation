import React, { Component } from "react";
import Link from "next/link";
var moment = require("moment");
require("moment-duration-format");

class Departure extends Component {
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
          this.props.modes.includes(this.props.departure.mode.title) ||
          (this.props.departure.line.includes("U") &&
            this.props.modes.includes("U-Bahn")) ||
          this.props.modes.length < 1
            ? "trans bg-gray-300 text-gray-900 font-medium font-inter rounded-lg overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex flex-shrink justify-between"
            : "hidden"
        }
        style={this.props.embed ? { minWidth: "32rem" } : {}}
      >
        <div className="w-3/4 sm:ml-1 my-auto">
          <p className="font-semibold text-2xl flex items-center leading-tight">
            <img
              style={
                this.state.imageError
                  ? { display: "hidden", marginRight: "0" }
                  : { height: "26px", marginRight: "0.5rem" }
              }
              src={
                this.props.departure.line.includes("U") &&
                this.props.departure.mode.title.includes("undefined")
                  ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                  : this.props.departure.mode.iconUrl
              }
              onError={() => {
                this.setState({ imageError: true });
              }}
            />
            <span className="truncate pt-1">{this.props.departure.line}</span>
          </p>
          <p className="text-lg font-normal truncate text-gray-800">
            {!this.props.embed ? (
              <Link
                href={"/monitor/stop/" + this.props.departure.direction.replace("/","%2F")}
                as={"/monitor/stop/" + this.props.departure.direction.replace("/","%2F")}
              >
                <span className="hover:underline cursor-pointer">
                  {this.props.departure.direction}
                </span>
              </Link>
            ) : (
              <span>{this.props.departure.direction}</span>
            )}
          </p>
        </div>
        <div className="w-1/4 sm:w-1/5 md:w-1/6 bg-gray-400 rounded-lg object-right p-2 sm:m-1 trans">
          <p className="text-center leading-tight">
            <span className="font-semibold text-2xl text-gray-800">
              {this.props.departure.arrivalTimeRelative < 60
                ? moment
                    .duration(
                      this.props.departure.arrivalTimeRelative,
                      "minutes"
                    )
                    .format("d[d] h[h] m[m]")
                : moment
                    .duration(
                      this.props.departure.arrivalTimeRelative,
                      "minutes"
                    )
                    .format("h[h]+")}
            </span>
            <br></br>
            <span className="font-thin text-gray-800 text-base">
              {new Date(Date.parse(this.props.departure.arrivalTime))
                .getHours()
                .toString()
                .padStart(2, "0") +
                ":" +
                new Date(Date.parse(this.props.departure.arrivalTime))
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>
    );
  }
}

export default Departure;
