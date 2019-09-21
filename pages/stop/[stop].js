import "react";
import { geolocated } from "react-geolocated";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../static/tailwind.css";
import { BarLoader } from "react-spinners";
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
      longitude: ""
    };
  }

  async findDepartures() {
    this.setState({ loading: true });
    var stopid = await dvb.findStop(this.state.stopName);
    this.setState({
      latitude: stopid[0].coords[1],
      longitude: stopid[0].coords[0]
    });
    var query = await dvb.monitor(stopid[0].id, 0, 10).catch((error) => {
      this.setState({ err: error.name });
    });
    if (this.state.err === "") {
      this.setState({ departures: query, loading: false });
    }
    this.forceUpdate();
  }

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
        <h1 className="font-semibold font-sans text-3xl text-gray-200 leading-tight mb-2">
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
        <div className="flex">
          <Link href="/" as="/">
            <button className="text-gray-300 bg-gray-900 px-4 py-2 rounded mr-3 focus:shadow-outline focus:outline-none trans">
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
                className="text-gray-300 bg-gray-900 px-4 py-2 rounded mr-3 focus:shadow-outline focus:outline-none trans"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt}></FontAwesomeIcon>
              </a>
              <button
                onClick={this.reloadDepartures}
                className="text-gray-300 bg-gray-900 px-4 py-2 rounded focus:shadow-outline focus:outline-none trans"
              >
                <FontAwesomeIcon icon={faRedoAlt}></FontAwesomeIcon>
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full sm:w-auto sm:max-w-lg mt-3">
          {this.state.departures.map((departure, index) => {
            if (departure.arrivalTimeRelative > -1) {
              return (
                <div
                  className="w-full bg-gray-900 text-gray-400 font-medium font-sans rounded overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex justify-between"
                  key={
                    departure.line +
                    departure.direction +
                    departure.arrivalTimeRelative
                  }
                >
                  <div>
                    <p className="font-bold text-2xl flex items-center">
                      <img
                        style={
                          this.state.imageError || !departure.mode.icon_url
                            ? { display: "hidden", marginRight: "0" }
                            : { height: "26px", marginRight: "0.5rem" }
                        }
                        src={
                          departure.line.includes("U")
                            ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                            : departure.mode.icon_url
                        }
                        onError={() => {
                          this.setState({ imageError: true });
                        }}
                      />
                      {departure.line}
                    </p>
                    <p className="font-medium text-lg">{departure.direction}</p>
                  </div>
                  <div>
                    <div className="bg-gray-800 rounded p-3">
                      <p className="font-semibold text-center text-2xl">
                        {moment
                          .duration(departure.arrivalTimeRelative, "minutes")
                          .format("d[d] h[h] m[m]")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default Stop;
