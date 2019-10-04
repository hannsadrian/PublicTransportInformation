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
      suggestions: [],
      date: "",
      time: "",
      from: "",
      to: "",
      currentTarget: ""
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: false });
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
      this.setState({ suggestions: [] });
    }
    this.setState({
      currentTarget: event.target.id,
      [event.target.id]: event.target.value
    });
  };

  suggestionClick = (event) => {
    event.preventDefault();
    var target = this.state.currentTarget;
    this.setState({ [target]: event.target.id, suggestions: [] });
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport Planner</title>
        </Head>
        <h1 className="font-semibold font-sans text-3xl text-gray-200 leading-tight">
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
              className="hover:bg-black w-3/12 text-lg font-sans font-semibold trans rounded-l px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
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
              className="hover:bg-black w-5/12 text-lg font-sans font-semibold trans rounded-r px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none mr-3"
            />
            <Link href="/" as="/">
              <button className="w-2/12 text-gray-300 bg-gray-900 px-4 rounded sm:hover:shadow-outline focus:outline-none trans">
                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
              </button>
            </Link>
          </div>
          <input
            placeholder="from"
            id="from"
            value={this.state.from}
            onChange={this.handleChange}
            className="hover:bg-black min-w-full text-lg font-sans font-semibold trans rounded-t px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
          ></input>
          <input
            placeholder="to"
            id="to"
            value={this.state.to}
            onChange={this.handleChange}
            className="hover:bg-black mb-3 min-w-full text-lg font-sans font-semibold trans rounded-b px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
          ></input>
          <div className="w-full bg-gray-900 text-gray-200 font-semibold font-sans rounded bg-gray-900">
            {this.state.suggestions.map((value, index) => {
              return (
                <div key={index}>
                  <a onClick={this.suggestionClick}>
                    <p
                      className={
                        (this.state.suggestions.length === 1
                          ? "rounded "
                          : index < 1
                          ? "rounded-t "
                          : index === this.state.suggestions.length - 1
                          ? "rounded-b "
                          : "") +
                        "z-50 py-3 sm:py-2 px-3 trans cursor-pointer sm:hover:shadow-outline"
                      }
                      id={value}
                    >
                      {value}
                    </p>
                    {index < this.state.suggestions.length - 1 ? (
                      <hr className="border-gray-800 z-0"></hr>
                    ) : (
                      <div></div>
                    )}
                  </a>
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
