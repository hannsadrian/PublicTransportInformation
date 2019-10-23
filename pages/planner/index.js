import "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import "../../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import Cleave from "cleave.js/react";
import Suggestions from "../../src/components/general/suggestions";
import * as dvb from "dvbjs";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      currentTarget: undefined,
      input: undefined
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: false });
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

  handleChange = event => {
    this.setState({
      currentTarget: event.target.id,
      [event.target.id]: event.target.value,
      input: event.target.value
    });
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

  redirect = async () => {
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
        <h1 className="font-semibold font-inter text-2xl text-gray-200">
          Public Transport Planner
        </h1>
        <p className="font-inter text-gray-500 mb-5">
          Where do you want to go?
        </p>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <div className="flex mb-3 sm:max-w-xs">
            <Link href="/" as="/">
              <button className="w-2/12 text-gray-300 bg-gray-900 px-4 rounded-lg mr-3 sm:hover:shadow-outline focus:outline-none trans">
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </button>
            </Link>
            <div className="flex rounded-lg overflow-hidden w-auto mr-3">
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
                className="hover:bg-black w-2/5 rounded-none text-lg font-inter font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none"
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
                className="hover:bg-black w-3/5 rounded-none text-lg font-inter font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              onClick={this.redirect}
              disabled={!this.checkValid()}
              className={
                "disabled:bg-unselected disabled:cursor-not-allowed w-2/12 text-gray-300 bg-gray-900 px-4 rounded-lg focus:outline-none trans" +
                (this.checkValid() ? " sm:hover:shadow-outline" : "")
              }
            >
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </button>
          </div>
          <div className="w-full bg-gray-900 text-gray-200 font-semibold font-inter rounded-lg bg-gray-900 mb-3">
            <Suggestions
              input={this.state.input}
              suggestionClick={this.suggestionClick}
              maxResults={3}
            ></Suggestions>
          </div>
          <div className="rounded-lg overflow-hidden">
            <input
              placeholder="from"
              onClick={this.setActive}
              id="from"
              value={this.state.from}
              onChange={this.handleChange}
              className="hover:bg-black rounded-none min-w-full text-lg font-inter font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
            ></input>
            <input
              placeholder="to"
              onClick={this.setActive}
              id="to"
              value={this.state.to}
              onChange={this.handleChange}
              className="hover:bg-black rounded-none min-w-full text-lg font-inter font-semibold trans px-3 py-2 bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
            ></input>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
