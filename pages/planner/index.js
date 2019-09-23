import "react";
import { geolocated } from "react-geolocated";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRedoAlt,
  faArrowLeft,
  faMapMarkerAlt,
  faSearch,
  faBus
} from "@fortawesome/free-solid-svg-icons";
import Cleave from "cleave.js/react";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: []
    };
  }

  componentDidMount = async () => {
    this.getLocation();
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

  onTimeChange(event) {
    // formatted pretty value
    console.log(event.target.value);

    // raw value
    console.log(event.target.rawValue);
  }
  onDateChange(event) {
    // formatted pretty value
    console.log(event.target.value);

    // raw value
    console.log(event.target.rawValue);
  }

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
          <title>Public Transport Planner</title>
        </Head>
        <h1 className="font-semibold font-sans text-3xl text-gray-200 leading-tight">
          Still under construction
        </h1>
        <p className="font-sans text-gray-500 leading-tight mb-5">
          Where do you wanna go?
        </p>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <div className="flex mb-3 sm:max-w-xs">
            <Link href="/" as="/">
              <button className="w-full text-gray-300 bg-gray-900 px-4 rounded mr-3 sm:hover:shadow-outline focus:outline-none trans">
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </button>
            </Link>
            <Cleave
              placeholder={
                String(new Date().getHours()).padStart(2, "0") +
                ":" +
                String(new Date().getMinutes()).padStart(2, "0")
              }
              options={{
                time: true,
                delimiter: ":",
                timePattern: ["h", "m"]
              }}
              onChange={this.onTimeChange}
              className="text-lg font-sans font-semibold trans rounded-l px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
            />
            <Cleave
              placeholder={
                String(new Date().getDate()).padStart(2, "0") +
                "." +
                String(new Date().getMonth() + 1).padStart(2, "0") +
                "." +
                new Date().getFullYear()
              }
              options={{
                date: true,
                delimiter: ".",
                datePattern: ["d", "m", "Y"]
              }}
              onChange={this.onDateChange}
              className="text-lg font-sans font-semibold trans rounded-r px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none mr-3"
            />
            <Link href="/" as="/">
              <button className="w-full text-gray-300 bg-gray-900 px-4 rounded mr-3 sm:hover:shadow-outline focus:outline-none trans">
                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
              </button>
            </Link>
          </div>
          <input
            placeholder="from"
            onChange={this.handleChange}
            className="min-w-full text-lg font-sans font-semibold trans rounded px-3 py-2 sm:hover:shadow-outline bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
          ></input>
          <div className="hidden w-full bg-gray-900 text-gray-200 font-semibold font-sans rounded overflow-hidden">
            {this.state.suggestions.map((value, index) => {
              return (
                <div key={index}>
                  <Link
                    prefetch
                    href="/monitor/stop/[stop]"
                    as={"/monitor/stop/" + value.replace("/", "%2F")}
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
