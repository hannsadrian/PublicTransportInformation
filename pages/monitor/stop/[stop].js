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
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
var moment = require("moment");
require("moment-duration-format");

class Stop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stopName: "",
      stop: "",
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
        if (toPush !== "" && mot.indexOf(toPush) === -1) {
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

    event.target.classList.toggle("bg-unselected");
    event.target.classList.toggle("bg-gray-900");
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

  componentDidMount = async () => {
    await this.setState({
      stopName: decodeURI(
        this.props.originalProps.router.asPath
          .replace("/monitor/stop/", "")
          .replace("%2F", "/")
      )
    });
    this.findDepartures();
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>{this.state.stopName}</title>
        </Head>
        <h1 className="trans font-semibold font-inter text-2xl text-gray-200 truncate">
          {this.state.stopName}{" "}
        </h1>
        {this.state.err === "" && !this.state.loading ? (
          <a
            href={
              "https://maps.apple.com/?dirflg=w&daddr=" +
              this.state.latitude +
              "," +
              this.state.longitude
            }
            className="font-inter text-gray-500"
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
              color={"#e2e8f0"}
              loading={this.state.loading}
            />
          </div>
        ) : (
          <p className="p-1 pl-2 bg-red-600 text-gray-300 mt-4 mb-5 max-w-xs rounded-lg font-semibold">
            {this.state.err}
          </p>
        )}

        <div className="flex flex-wrap mt-5">
          <Link href="/monitor" as="/monitor">
            <button className="text-gray-300 bg-gray-900 px-4 py-2 rounded-lg mr-3 sm:hover:shadow-outline focus:outline-none trans mb-3">
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </button>
          </Link>
          {this.state.err === "" ? (
            <>
              <button
                onClick={this.reloadDepartures}
                className="text-gray-300 bg-gray-900 px-4 py-2 rounded-lg sm:hover:shadow-outline focus:outline-none trans mr-3 mb-3"
              >
                <FontAwesomeIcon icon={faRedoAlt}></FontAwesomeIcon>
              </button>
              {this.state.allModes.length > 1 ? (
                this.state.allModes.map((mode, index) => {
                  return (
                    <button
                      className="text-gray-300 px-4 py-2 rounded-lg focus:outline-none sm:hover:shadow-outline trans mr-3 truncate bg-unselected mb-3"
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
        <div className="w-full sm:w-auto sm:max-w-lg mb-6">
          {this.state.departures.map((departure, index) => {
            if (departure.arrivalTimeRelative > -1) {
              return (
                <div
                  className={
                    this.state.modes.includes(departure.mode.title) ||
                    (departure.line.includes("U") &&
                      this.state.modes.includes("U-Bahn")) ||
                    this.state.modes.length < 1
                      ? "trans w-full bg-gray-900 text-gray-400 font-medium font-inter rounded-lg overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex flex-shrink justify-between"
                      : "hidden trans w-full bg-gray-900 text-gray-400 font-medium font-inter rounded-lg overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex flex-shrink justify-between"
                  }
                  key={
                    departure.line +
                    departure.direction +
                    departure.arrivalTimeRelative
                  }
                >
                  <div className="w-3/4 ml-1 my-auto">
                    <p className="font-semibold text-2xl flex items-center leading-tight">
                      <img
                        style={
                          this.state.imageError
                            ? { display: "hidden", marginRight: "0" }
                            : { height: "26px", marginRight: "0.5rem" }
                        }
                        src={
                          departure.line.includes("U") &&
                          departure.mode.title.includes("undefined")
                            ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                            : departure.mode.iconUrl
                        }
                        onError={() => {
                          this.setState({ imageError: true });
                        }}
                      />
                      <span className="truncate pt-1">{departure.line}</span>
                    </p>
                    <p className="text-lg font-normal truncate">
                      {departure.direction}
                    </p>
                  </div>
                  <div className="w-1/4 sm:w-1/5 md:w-1/6 bg-gray-800 rounded-lg object-right p-2 sm:m-1 trans">
                    <p className="text-center leading-tight">
                      <span className="font-semibold text-2xl">
                        {departure.arrivalTimeRelative < 60
                          ? moment
                              .duration(
                                departure.arrivalTimeRelative,
                                "minutes"
                              )
                              .format("d[d] h[h] m[m]")
                          : moment
                              .duration(
                                departure.arrivalTimeRelative,
                                "minutes"
                              )
                              .format("h[h]+")}
                      </span>
                      <br></br>
                      <span className="font-thin text-gray-500 text-base">
                        {new Date(Date.parse(departure.arrivalTime))
                          .getHours()
                          .toString()
                          .padStart(2, "0") +
                          ":" +
                          new Date(Date.parse(departure.arrivalTime))
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}
                      </span>
                    </p>
                  </div>
                </div>
              );
            }
          })}
          {!this.state.loading &&
          !this.state.err &&
          this.state.allModes.length > 1 ? (
            <p className="text-gray-600">
              Showing{" "}
              {this.state.modes.length === 0 ||
              this.state.modes.length === this.state.allModes.length
                ? "all departures"
                : "departures for" +
                  this.state.modes.map((value, index) => {
                    return " " + value;
                  })}
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

export default Stop;
