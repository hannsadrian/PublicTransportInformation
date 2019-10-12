import React, { Component } from "react";
import Suggestion from "../../elements/general/suggestion";
import * as dvb from "dvbjs";
import { geolocated } from "react-geolocated";

class Suggestions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: []
    };
  }

  componentDidUpdate(nextProps) {
    if (nextProps === this.props) {
      return;
    }
    if (this.props.input === undefined) {
      return;
    }
    if (this.props.input.length > 0) {
      this.findSuggestions(this.props.input);
    } else {
      this.getLocation();
    }
  }

  getLocation = async () => {
    if (!this.props.coords) {
      setTimeout(this.getLocation, 100);
      return;
    }
    if (this.props.isGeolocationAvailable && this.props.isGeolocationEnabled) {
      var stops = await dvb.findAddress(
        this.props.coords.longitude,
        this.props.coords.latitude
      );

      var locationSuggestions = [];

      stops.stops.forEach(stop => {
        locationSuggestions.push(stop);
      });

      this.setState({ suggestions: locationSuggestions });
    }
  };

  findSuggestions = async input => {
    if (this.props.stopsOnly) {
      var stops = await dvb.findStop(input);
    } else {
      var stops = await dvb.findPOI(input);
    }

    var suggestions = [];

    stops.map((value, index) => {
      if (index < this.props.maxResults) {
        suggestions.push(value);
      }
    });

    this.setState({ suggestions: suggestions });
  };

  suggestionClick = async event => {
    event.preventDefault();
    this.setState({ suggestions: [] });
    this.props.suggestionClick(event);
  };

  render() {
    return (
      <>
        {this.state.suggestions.map((value, index) => (
          <Suggestion
            key={index}
            value={value}
            index={index}
            suggestions={this.state.suggestions}
            suggestionClick={this.suggestionClick}
          ></Suggestion>
        ))}
      </>
    );
  }
}

export default geolocated({
  userDecisionTimeout: 5000
})(Suggestions);
