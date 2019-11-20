import "react";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../../static/tailwind.css";
import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRedoAlt,
  faArrowLeft,
  faMapMarkerAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import Departure from "../../../src/elements/general/departure";

class Stop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stopName: "",
      stop: [],
      departures: [],
      err: "",
      loading: true,
      imageError: false,
      latitude: "",
      longitude: "",
      modes: [],
      allModes: []
    };
  }

  async findDepartures() {
    this.setState({ loading: true });
    var stop = await dvb.findStop(this.state.stopName);
    this.setState({
      latitude: stop[0].coords[1],
      longitude: stop[0].coords[0],
      stop: stop
    });
    var query = await dvb.monitor(stop[0].id, 0, 30).catch(error => {
      this.setState({ err: error.name + ": " + error.message, loading: false });
    });
    if (this.state.err === "") {
      const mot = [];
      query.forEach(departure => {
        var toPush = "";
        if (
          departure.mode.title.includes("undefined") &&
          departure.line.includes("U")
        ) {
          toPush = "U-Bahn";
        } else if (!departure.mode.title.includes("undefined")) {
          toPush = departure.mode.title;
        }
        if (
          toPush !== "" &&
          mot.indexOf(toPush) === -1 &&
          departure.arrivalTimeRelative > -1
        ) {
          mot.push(toPush);
        }
      });
      this.setState({
        allModes: Object.assign([], mot),
        departures: query,
        loading: false
      });
    }
    this.forceUpdate();
  }

  toggleMode = event => {
    var modes = this.state.modes;
    var mode = event.target.innerHTML;

    event.target.classList.toggle("sm:bg-gray-300");
    event.target.classList.toggle("sm:bg-gray-400");
    event.target.classList.toggle("bg-gray-100");
    event.target.classList.toggle("bg-gray-300");
    if (modes.indexOf(mode) === -1) {
      modes.push(mode);
      this.setState({
        modes: modes
      });
    } else {
      modes.splice(modes.indexOf(mode), 1);
      this.setState({
        modes: modes
      });
    }
  };

  reloadDepartures = event => {
    event.preventDefault();
    this.findDepartures();
  };

  componentWillReceiveProps = async nextProps => {
    if (nextProps.stop !== "") {
      await this.setState({
        stopName: nextProps.stop
      });
      this.findDepartures();
    } else {
      this.setState({
        stopName: "",
        stop: [],
        departures: [],
        err: "",
        loading: true,
        latitude: "",
        longitude: "",
        modes: [],
        allModes: []
      });
    }
  };

  componentDidMount = async () => {
    if (!this.props.embed) {
      await this.setState({
        stopName: decodeURI(
          this.props.originalProps.router.asPath
            .replace("/monitor/stop/", "")
            .replace("%2F", "/")
        )
      });
      this.findDepartures();
    }
  };

  render() {
    return (
      <div
        className={
          this.props.stop === "" ? "hidden" : "overflow-hidden max-h-screen"
        }
      >
        <div
          className={
            !this.props.embed
              ? "p-6 pt-12 sm:p-20 lg:pl-56"
              : "p-6 hidden lg:block"
          }
          style={this.props.embed ? { paddingTop: "0.50rem" } : {}}
        >
          {!this.props.embed ? (
            <Head>
              <title>
                {this.state.stop.length > 0
                  ? this.state.stop[0].name + ", " + this.state.stop[0].city
                  : "Loading"}
              </title>
            </Head>
          ) : (
            <></>
          )}
          <h1 className="trans font-semibold font-inter text-2xl text-black truncate">
            {this.state.stop.length > 0
              ? this.state.stop[0].name + ", " + this.state.stop[0].city
              : "Loading"}
          </h1>
          {this.state.err === "" && !this.state.loading ? (
            <a
              href={
                "https://maps.apple.com/?dirflg=w&daddr=" +
                this.state.latitude +
                "," +
                this.state.longitude
              }
              className="font-inter text-gray-700"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt}></FontAwesomeIcon>
              {" " +
                this.state.latitude.toString().substring(0, 10) +
                ", " +
                this.state.longitude.toString().substring(0, 10)}
            </a>
          ) : this.state.err === "" ? (
            <div className="rounded-lg overflow-hidden max-w-xs pb-2 pt-3">
              <BarLoader
                heightUnit={"px"}
                height={4}
                widthUnit={"px"}
                width={330}
                color={"#1a202c"}
                loading={this.state.loading}
              />
            </div>
          ) : (
            <p className="p-1 pl-2 bg-red-600 text-gray-300 mt-4 mb-5 max-w-xs rounded-lg font-semibold">
              {this.state.err}
            </p>
          )}

          <div className="flex mt-5 mb-3 overflow-scroll overflow-y-hidden scrolling-touch custom-scrollbar w-auto rounded-lg">
            {!this.props.embed ? (
              <Link href="/monitor" as="/monitor">
                <button className="text-gray-900 bg-gray-300 sm:hover:bg-gray-300 px-4 py-3 rounded-lg mr-3 sm:hover:shadow-lg focus:outline-none trans">
                  <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                </button>
              </Link>
            ) : (
              <button
                onClick={this.props.closeEmbed}
                className="text-gray-900 bg-gray-300 sm:hover:bg-gray-300 px-4 py-3 rounded-lg mr-3 sm:hover:shadow-lg focus:outline-none trans"
              >
                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
              </button>
            )}
            {this.state.err === "" ? (
              <>
                <button
                  onClick={this.reloadDepartures}
                  className="text-gray-900 bg-gray-300 sm:hover:bg-gray-300 px-4 py-3 rounded-lg mr-3 sm:hover:shadow-lg focus:outline-none trans"
                >
                  <FontAwesomeIcon icon={faRedoAlt}></FontAwesomeIcon>
                </button>
                {this.state.allModes.length > 1 ? (
                  this.state.allModes.map((mode, index) => {
                    return (
                      <button
                        className="whitespace-no-wrap text-gray-900 bg-gray-300 sm:bg-gray-400 sm:hover:bg-gray-300 px-4 py-3 rounded-lg mr-3 sm:hover:shadow-lg focus:outline-none trans"
                        onClick={this.toggleMode}
                      >
                        {mode}
                      </button>
                    );
                  })
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          <div
            style={{ height: "70vh" }}
            className="w-full sm:w-auto sm:max-w-lg mb-3 overflow-scroll overflow-x-hidden custom-scrollbar scrolling-touch rounded-lg pb-40"
          >
            {this.state.departures.map((departure, index) => {
              if (departure.arrivalTimeRelative > -1) {
                return (
                  <Departure
                    key={
                      this.props.departure.line +
                      this.props.departure.direction +
                      this.props.departure.arrivalTimeRelative
                    }
                    modes={this.state.modes}
                    departure={departure}
                    embed={this.props.embed}
                  ></Departure>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Stop;
