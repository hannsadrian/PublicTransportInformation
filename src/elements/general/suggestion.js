import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospitalSymbol,
  faHome,
  faMapMarker
} from "@fortawesome/free-solid-svg-icons";

class Suggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div key={this.props.index}>
        <button
          onClick={this.props.suggestionClick}
          className={
            (this.props.suggestions.length === 1
              ? "rounded "
              : this.props.index < 1
              ? "rounded-t "
              : this.props.index === this.props.suggestions.length - 1
              ? "rounded-b "
              : "") +
            "z-50 py-3 sm:py-2 px-3 trans w-full cursor-pointer sm:hover:shadow-outline outline-none focus:outline-none flex justify-between"
          }
          id={this.props.value.name + ", " + this.props.value.city}
        >
          <span
            className="truncate text-left"
            id={this.props.value.name + ", " + this.props.value.city}
          >
            {this.props.value.name + ", " + this.props.value.city}
          </span>
          <div>
            <FontAwesomeIcon
              className="ml-2 cursor-default"
              icon={
                this.props.value.type === "Stop"
                  ? faHospitalSymbol
                  : this.props.value.type === "Address"
                  ? faHome
                  : faMapMarker
              }
            ></FontAwesomeIcon>
          </div>
        </button>
        {this.props.index < this.props.suggestions.length - 1 ? (
          <hr className="border-gray-800 z-0"></hr>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default Suggestion;
