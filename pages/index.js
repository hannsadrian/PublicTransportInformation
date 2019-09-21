import "react";
import { geolocated } from "react-geolocated";
import * as dvb from "dvbjs";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import "../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Offline, Online } from "react-detect-offline";
import {
  faHome,
  faRedoAlt,
  faArrowLeft,
  faMapMarkerAlt,
  faSearch,
  faBus
} from "@fortawesome/free-solid-svg-icons";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: []
    };
  }

  componentDidMount = async () => {
    if (this.props.url.query.stop && navigator.onLine) {
      return;
    } else {
      this.getLocation();
    }

    if (!navigator.onLine) {
      Router.push("/");
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) =>
          console.error("Service worker registration failed", err)
        );
    } else {
      console.log("Service worker not supported");
    }
    this.setState({ loading: false });
  };

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

      stops.stops.forEach((stop) => {
        locationSuggestions.push(stop.name + ", " + stop.city);
      });

      this.setState({ suggestions: locationSuggestions });
    }
  };

  findSuggestions = async (input) => {
    var stops = await dvb.findStop(input);

    var suggestions = [];

    stops.map((value, index) => {
      if (index < 8) {
        suggestions.push(value.name + ", " + value.city);
      }
    });

    this.setState({ suggestions: suggestions });
  };

  handleChange = (event) => {
    this.setState({
      input: event.target.value
    });
    if (event.target.value.length > 0) {
      this.findSuggestions(event.target.value);
    } else {
      this.getLocation();
    }
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport Monitor</title>
        </Head>
        <h1 className="font-semibold font-sans text-3xl text-gray-200 mb-5 leading-tight">
          Public Transport Monitor
        </h1>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <input
            placeholder="stop"
            onChange={this.handleChange}
            className="mb-5 shadow w-full text-lg font-sans font-semibold trans rounded px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
          ></input>
          <div className="w-full bg-gray-900 text-gray-200 font-semibold font-sans rounded overflow-hidden">
            {this.state.suggestions.map((value, index) => {
              return (
                <div key={index}>
                  <Link
                    prefetch
                    href="/stop/[stop]"
                    as={"/stop/" + value.replace("/", "%2F")}
                  >
                    <a>
                      <p className="py-3 sm:py-2 px-3 hover:bg-black trans cursor-pointer">
                        {value}
                      </p>
                    </a>
                  </Link>
                  {index < this.state.suggestions.length - 1 ? (
                    <hr className="border-gray-800 mx-2"></hr>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default geolocated({
  userDecisionTimeout: 5000
})(Index);
