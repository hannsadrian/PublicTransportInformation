import "react";
import * as dvb from "../../src/dvbjs";
import Head from "next/head";
import Link from "next/link";
import { geolocated } from "react-geolocated";
import Router from "next/router";
import "../../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRedoAlt,
  faArrowLeft,
  faMapMarkerAlt,
  faSearch,
  faBus,
  faHospitalSymbol,
  faLocationArrow,
  faMapMarker
} from "@fortawesome/free-solid-svg-icons";
import Cleave from "cleave.js/react";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      date:
        String(new Date().getDate()).padStart(2, "0") +
        "." +
        String(new Date().getMonth() + 1).padStart(2, "0") +
        "." +
        new Date().getFullYear(),
      time:
        String(new Date().getHours()).padStart(2, "0") +
        ":" +
        String(new Date().getMinutes()).padStart(2, "0"),
      from: "",
      to: "",
      currentTarget: ""
    };
  }

  componentDidMount = async () => {
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
        locationSuggestions.push(stop);
      });

      this.setState({ suggestions: locationSuggestions });
    }
  };

  onTimeChange(event) {
    this.setState({
      time:
        event.target.value.length === 0
          ? String(new Date().getHours()).padStart(2, "0") +
            ":" +
            String(new Date().getMinutes()).padStart(2, "0")
          : event.target.value
    });
  }
  onDateChange(event) {
    this.setState({
      date:
        event.target.value.length === 0
          ? String(new Date().getDate()).padStart(2, "0") +
            "." +
            String(new Date().getMonth() + 1).padStart(2, "0") +
            "." +
            new Date().getFullYear()
          : event.target.value
    });
  }

  findSuggestions = async (input) => {
    var stops = await dvb.findPOI(input);

    var suggestions = [];

    stops.map((value, index) => {
      if (index < 8) {
        suggestions.push(value);
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
      this.getLocation()
    }
    this.setState({
      currentTarget: event.target.id,
      [event.target.id]: event.target.value
    });
  };

  setActive = (event) => {
    this.setState({
      currentTarget: event.target.id
    });
    if (event.target.value.length === 0) {
      this.getLocation()
    }
  }

  suggestionClick = (event) => {
    event.preventDefault();
    var target = this.state.currentTarget;
    console.log(event.target)
    this.setState({ [target]: event.target.id, suggestions: [] });
  };

  checkValid = () => {
    if (
      this.state.from.length > 0 &&
      this.state.to.length > 0 &&
      this.state.time.length > 4 &&
      this.state.date.length > 9
    ) {
      return true;
    } else {
      return false;
    }
  };

  redirect = () => {
    if (!this.checkValid()) {
      return;
    }
    Router.push(
      "/planner/plan?origin=" +
        this.state.from.replace("/", "%2F") +
        "&destination=" +
        this.state.to.replace("/", "%2F") +
        "&time=" +
        this.state.time +
        "&date=" +
        this.state.date
    );
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport Planner</title>
        </Head>
        <h1 className="font-semibold font-sans text-2xl text-gray-200 leading-tight">
          Public Transport Planner
        </h1>
        <p className="font-sans text-gray-500 leading-tight mb-5">
          Where do you wanna go?
        </p>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <div className="flex mb-3 sm:max-w-xs">
            <Link href="/" as="/">
              <button className="w-2/12 text-gray-300 bg-gray-900 px-4 rounded mr-3 sm:hover:shadow-outline focus:outline-none trans">
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </button>
            </Link>
            <div className="flex rounded overflow-hidden w-auto mr-3">
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
                onChange={this.onTimeChange.bind(this)}
                className="hover:bg-black w-2/5 rounded-none text-lg font-sans font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none"
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
                onChange={this.onDateChange.bind(this)}
                className="hover:bg-black w-3/5 rounded-none text-lg font-sans font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              onClick={this.redirect}
              disabled={!this.checkValid()}
              className={
                "disabled:bg-unselected disabled:cursor-not-allowed w-2/12 text-gray-300 bg-gray-900 px-4 rounded focus:outline-none trans" +
                (this.checkValid() ? " sm:hover:shadow-outline" : "")
              }
            >
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </button>
          </div>
          <div className="w-full bg-gray-900 text-gray-200 font-semibold font-sans rounded bg-gray-900 mb-3">
            {this.state.suggestions.map((value, index) => {
              return (
                <div key={index}>
                    <button
                      onClick={this.suggestionClick}
                      className={
                        (this.state.suggestions.length === 1
                          ? "rounded "
                          : index < 1
                          ? "rounded-t "
                          : index === this.state.suggestions.length - 1
                          ? "rounded-b "
                          : "") +
                        "z-50 py-3 sm:py-2 px-3 trans w-full cursor-pointer sm:hover:shadow-outline outline-none focus:outline-none flex justify-between"
                      }
                      id={value.name + ", " + value.city}
                    >
                      <span className="truncate" id={value.name + ", " + value.city}>{value.name + ", " + value.city}</span>
                      <div id={value.name + ", " + value.city}><FontAwesomeIcon className="ml-2" icon={value.type === "Stop" ? faHospitalSymbol : value.type === "Address" ? faHome : faMapMarker}></FontAwesomeIcon></div>
                    </button>
                    {index < this.state.suggestions.length - 1 ? (
                      <hr className="border-gray-800 z-0"></hr>
                    ) : (
                      <div></div>
                    )}
                </div>
              );
            })}
          </div>
          <div className="rounded overflow-hidden">
            <input
              placeholder="from"
              onClick={this.setActive}
              id="from"
              value={this.state.from}
              onChange={this.handleChange}
              className="hover:bg-black min-w-full rounded-none text-lg font-sans font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
            ></input>
            <input
              placeholder="to"
              onClick={this.setActive}
              id="to"
              value={this.state.to}
              onChange={this.handleChange}
              className="hover:bg-black min-w-full rounded-none text-lg font-sans font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
            ></input>
          </div>
          
        </div>
      </div>
    );
  }
}

export default geolocated({
  userDecisionTimeout: 5000
})(Index);
