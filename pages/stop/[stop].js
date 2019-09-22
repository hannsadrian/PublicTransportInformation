import "react";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../static/tailwind.css";
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
    var stopid = await dvb.findStop(this.state.stopName);
    this.setState({
      latitude: stopid[0].coords[1],
      longitude: stopid[0].coords[0]
    });
    var query = await dvb.monitor(stopid[0].id, 0, 30).catch((error) => {
      this.setState({ err: error.name });
    });
    if (this.state.err === "") {
      const mot = [];
      query.forEach((departure) => {
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

  toggleMode = (event) => {
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

  reloadDepartures = (event) => {
    event.preventDefault();
    this.findDepartures();
  };

  componentDidMount = async () => {
    await this.setState({
      stopName: decodeURI(
        this.props.url.asPath.replace("/stop/", "").replace("%2F", "/")
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
        <h1 className="trans font-semibold font-sans text-3xl text-gray-200 leading-tight mb-2">
          {this.state.stopName}{" "}
        </h1>
        <div className="rounded overflow-hidden max-w-xs mb-2">
          <BarLoader
            heightUnit={"px"}
            height={4}
            widthUnit={"px"}
            width={330}
            color={"#e2e8f0"}
            loading={this.state.loading}
          />
        </div>
        {this.state.err !== "" ? (
          <p className="p-1 pl-2 bg-red-600 text-gray-300 my-4 max-w-xs rounded font-semibold">
            {this.state.err}
          </p>
        ) : (
          <></>
        )}
        <div className="flex flex-wrap">
          <Link href="/" as="/">
            <button className="text-gray-300 bg-gray-900 px-4 py-2 rounded mr-3 hover:shadow-outline focus:outline-none trans mb-3">
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </button>
          </Link>
          {this.state.err === "" ? (
            <>
              <a
                href={
                  "https://maps.apple.com/?dirflg=w&daddr=" +
                  this.state.latitude +
                  "," +
                  this.state.longitude
                }
                className="text-gray-300 bg-gray-900 px-4 py-2 rounded mr-3 hover:shadow-outline focus:outline-none trans mb-3"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt}></FontAwesomeIcon>
              </a>
              <button
                onClick={this.reloadDepartures}
                className="text-gray-300 bg-gray-900 px-4 py-2 rounded hover:shadow-outline focus:outline-none trans mr-3 mb-3"
              >
                <FontAwesomeIcon icon={faRedoAlt}></FontAwesomeIcon>
              </button>
              {this.state.allModes.length > 1 ? (
                this.state.allModes.map((mode, index) => {
                  return (
                    <button
                      className="text-gray-300 px-4 py-2 rounded focus:outline-none hover:shadow-outline trans mr-3 truncate bg-unselected mb-3"
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
                      ? "trans w-full bg-gray-900 text-gray-400 font-medium font-sans rounded overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex flex-shrink justify-between"
                      : "hidden trans w-full bg-gray-900 text-gray-400 font-medium font-sans rounded overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex flex-shrink justify-between"
                  }
                  key={
                    departure.line +
                    departure.direction +
                    departure.arrivalTimeRelative
                  }
                >
                  <div className="w-3/4">
                    <p className="font-bold text-2xl flex items-center">
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
                            : departure.mode.icon_url
                        }
                        onError={() => {
                          this.setState({ imageError: true });
                        }}
                      />
                      <span className="truncate">{departure.line}</span>
                    </p>
                    <p className="font-medium text-lg truncate">
                      {departure.direction}
                    </p>
                  </div>
                  <div className="w-1/4 sm:w-1/5 md:w-1/6 bg-gray-800 rounded p-3 object-right trans">
                    <p className="font-semibold text-center text-2xl">
                      {departure.arrivalTimeRelative < 60
                        ? moment
                            .duration(departure.arrivalTimeRelative, "minutes")
                            .format("d[d] h[h] m[m]")
                        : moment
                            .duration(departure.arrivalTimeRelative, "minutes")
                            .format(">h[h]")}
                    </p>
                  </div>
                </div>
              );
            }
          })}
          {!this.state.loading ? (
            <p className="text-gray-600 -mt-1">
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
