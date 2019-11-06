import "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import "../../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faTimes,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import Cleave from "cleave.js/react";
import Suggestions from "../../src/components/general/suggestions";
import * as dvb from "dvbjs";
import { BarLoader } from "react-spinners";

const INITIAL_STATE = {
  date: "",
  time: "",
  from: "",
  to: "",
  currentTarget: undefined,
  input: undefined
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidMount = async () => {
    this.setState({ loading: false });
    if (localStorage.getItem("to") !== null) {
      this.setState({
        from: localStorage.getItem("from")
      });
    }
    if (localStorage.getItem("to") !== null) {
      this.setState({
        to: localStorage.getItem("to")
      });
    }
    if (localStorage.getItem("date") !== null) {
      this.setState({ date: localStorage.getItem("date") });
    }
    if (localStorage.getItem("time") !== null) {
      this.setState({ time: localStorage.getItem("time") });
    }
  };

  onTimeChange(event) {
    this.setState({
      time: event.target.value
    });
    localStorage.setItem("time", event.target.value);
  }
  onDateChange(event) {
    this.setState({
      date: event.target.value
    });
    localStorage.setItem("date", event.target.value);
  }

  handleChange = event => {
    this.setState({
      currentTarget: event.target.id,
      [event.target.id]: event.target.value,
      input: event.target.value
    });
    localStorage.setItem([event.target.id], event.target.value);
  };
  setActive = event => {
    this.setState({
      currentTarget: event.target.id,
      input: event.target.value
    });
  };
  suggestionClick = event => {
    this.setState({
      [this.state.currentTarget]: event.target.id,
      input: undefined
    });
    localStorage.setItem([this.state.currentTarget], event.target.id);
  };

  checkValid = () => {
    if (this.state.from.length > 0 && this.state.to.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  redirect = async () => {
    this.setState({ loading: true });
    var time =
      String(new Date().getHours()).padStart(2, "0") +
      ":" +
      String(new Date().getMinutes()).padStart(2, "0");
    var date =
      String(new Date().getDate()).padStart(2, "0") +
      "." +
      String(new Date().getMonth() + 1).padStart(2, "0") +
      "." +
      new Date().getFullYear();

    this.state.time.length > 0 ? (time = this.state.time) : () => {};
    this.state.date.length > 0 ? (date = this.state.date) : () => {};

    if (!this.checkValid()) {
      return;
    }
    var origin = await dvb.findPOI(this.state.from);
    var destination = await dvb.findPOI(this.state.to);
    if (origin.length < 1 || destination.length < 1) {
      return;
    }
    Router.push(
      "/planner/plan?origin=" +
        origin[0].id +
        "&destination=" +
        destination[0].id +
        "&time=" +
        time +
        "&date=" +
        date
    );
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport Planner</title>
        </Head>
        <h1 className="font-semibold font-inter text-2xl text-black">
          Public Transport Monitor
        </h1>
        {!this.state.loading ? (
          <p className="font-inter text-gray-700 mb-5">
            Where do you want to go?
          </p>
        ) : (
          <div className="rounded-lg overflow-hidden max-w-xs pb-8 pt-2">
            <BarLoader
              heightUnit={"px"}
              height={4}
              widthUnit={"px"}
              width={330}
              color={"#1a202c"}
              loading={this.state.loading}
            />
          </div>
        )}
        <div className="w-full sm:w-auto sm:max-w-xs">
          <div className="flex mb-3 sm:max-w-xs">
            <Link href="/" as="/">
              <button className="w-2/12 text-gray-900 bg-gray-300 px-4 rounded-lg mr-3 sm:hover:shadow-lg z-50 relative  sm:hover:bg-gray-300 focus:outline-none trans">
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </button>
            </Link>
            <div className="flex w-auto sm:overflow-visible overflow-hidden rounded-lg sm:rounded-none mr-3">
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
                value={this.state.time}
                onChange={this.onTimeChange.bind(this)}
                className="w-2/5 sm:mr-1 rounded-none sm:rounded-lg text-lg font-inter font-semibold trans z-50 relative px-3 py-2 bg-gray-300  sm:hover:bg-gray-300 focus:bg-gray-300 z-50 relative text-gray-800 placeholder-gray-700 sm:hover:shadow-lg focus:shadow-lg focus:outline-none"
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
                value={this.state.date}
                onChange={this.onDateChange.bind(this)}
                className="w-3/5 rounded-none sm:rounded-lg text-lg font-inter font-semibold trans px-3 py-2 bg-gray-300 z-50 relative  sm:hover:bg-gray-300 focus:bg-gray-300 z-50 relative text-gray-800 placeholder-gray-700 sm:hover:shadow-lg focus:shadow-lg focus:outline-none"
              />
            </div>
            <button
              onClick={this.redirect}
              disabled={!this.checkValid()}
              className={
                "w-2/12 text-gray-900 bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 rounded-lg z-50 relative  focus:outline-none trans" +
                (this.checkValid()
                  ? " sm:hover:shadow-lg sm:hover:bg-gray-300"
                  : "")
              }
            >
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </button>
          </div>
          <div className="w-full font-semibold font-inter mb-3">
            <Suggestions
              input={this.state.input}
              suggestionClick={this.suggestionClick}
              maxResults={3}
              clearSuggestions={true}
            ></Suggestions>
          </div>
          <div className="sm:overflow-visible overflow-hidden rounded-lg">
            <input
              placeholder="from"
              onClick={this.setActive}
              id="from"
              value={this.state.from}
              onChange={this.handleChange}
              className="w-full sm:mb-1 rounded-none sm:rounded-lg text-lg font-inter font-semibold trans px-3 py-2 bg-gray-300 z-20 relative  sm:hover:bg-gray-300 focus:bg-gray-300 text-gray-800 placeholder-gray-700 sm:hover:shadow-lg focus:shadow-lg focus:outline-none"
            ></input>
            <input
              placeholder="to"
              onClick={this.setActive}
              id="to"
              value={this.state.to}
              onChange={this.handleChange}
              className="w-full rounded-none sm:rounded-lg text-lg font-inter font-semibold trans px-3 py-2 bg-gray-300 z-10 relative  sm:hover:bg-gray-300 focus:bg-gray-300 text-gray-800 placeholder-gray-700 sm:hover:shadow-lg focus:shadow-lg focus:outline-none"
            ></input>
          </div>
          <button
            onClick={() => {
              this.setState(INITIAL_STATE);
              localStorage.clear();
            }}
            className="w-full rounded-lg text-lg font-inter font-semibold trans mt-4 px-3 py-2 bg-gray-300  sm:hover:bg-gray-300 focus:bg-gray-300 text-gray-800 placeholder-gray-700 sm:hover:shadow-lg focus:shadow-lg focus:outline-none"
          >
            <FontAwesomeIcon
              className="text-base"
              icon={faTimesCircle}
            ></FontAwesomeIcon>{" "}
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default Index;
