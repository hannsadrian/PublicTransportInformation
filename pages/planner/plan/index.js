import "react";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../../static/tailwind.css";
import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExchangeAlt,
  faClock,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
var moment = require("moment");
require("moment-duration-format");

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: {},
      err: "",
      loading: true,
      imageError: false
    };
  }

  componentDidMount = async () => {
    var query = this.props.originalProps.router.query;

    var origin = await dvb.findPOI(query.origin);
    var destination = await dvb.findPOI(query.destination);

    var time = query.time.split(":");
    var date = query.date.split(".");

    var departure = new Date();
    departure.setHours(time[0]);
    departure.setMinutes(time[1]);
    departure.setFullYear(date[2], date[1] - 1, date[0]);

    var route = await dvb
      .route(origin[0].id, destination[0].id, departure, false)
      .catch(error => {
        this.setState({
          err: error.name + ": " + error.message,
          loading: false
        });
      });

    if (this.state.err === "") {
      this.setState({ route: route, loading: false });
    }
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport Planner</title>
        </Head>
        <div className="flex">
          <Link href="/planner" as="/planner">
            <button className="text-gray-300 bg-gray-900 px-4 h-12 w-12 mr-3 rounded sm:hover:shadow-outline focus:outline-none trans">
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </button>
          </Link>
          <h1 className="font-semibold font-inter text-2xl my-auto text-gray-200 mb-3 leading-tight">
            Public Transport Planner
          </h1>
        </div>

        {this.state.loading ? (
          <div className="rounded overflow-hidden max-w-xs pb-2 pt-3">
            <BarLoader
              heightUnit={"px"}
              height={4}
              widthUnit={"px"}
              width={330}
              color={"#e2e8f0"}
              loading={true}
            />
          </div>
        ) : this.state.err !== "" ? (
          <p className="p-1 pl-2 bg-red-600 text-gray-300 mt-4 mb-5 max-w-xs rounded font-semibold">
            {this.state.err}
          </p>
        ) : (
          <></>
        )}
        {this.state.err === "" &&
        this.state.route.trips &&
        this.state.route.trips.length > 0 ? (
          <div>
            {this.state.route.trips.map((trip, index) => (
              <div className="p-1 pl-4 pr-4 pt-4 bg-gray-900 text-gray-300 mt-4 max-w-sm rounded">
                {trip.departure !== undefined ? (
                  <p className="leading-tight font-semibold truncate mt-2">
                    <span className="text-xl">
                      {trip.departure.name + ", " + trip.departure.city}
                    </span>{" "}
                    <br></br>
                    <span className="tracking-tighter text-gray-600 font-light font-mono ml-2">
                      {String(trip.departure.time.getHours()).padStart(2, "0") +
                        ":" +
                        String(trip.departure.time.getMinutes()).padStart(
                          2,
                          "0"
                        ) +
                        " " +
                        String(trip.departure.time.getDate()).padStart(2, "0") +
                        "." +
                        String(trip.departure.time.getMonth() + 1).padStart(
                          2,
                          "0"
                        ) +
                        "." +
                        String(trip.departure.time.getFullYear())}

                      {trip.departure.platform !== undefined ? (
                        <>
                          <span className="uppercase tracking-wide">
                            {" | " +
                              trip.departure.platform.type +
                              " " +
                              trip.departure.platform.name}
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </span>
                  </p>
                ) : (
                  <></>
                )}
                <div className="my-3 ml-2 font-mono">
                  <p>
                    <FontAwesomeIcon
                      icon={faExchangeAlt}
                      className="mr-3 h-4"
                    ></FontAwesomeIcon>
                    <span className="my-auto">
                      {trip.interchanges}{" "}
                      {trip.interchanges === 1 ? "interchange" : "interchanges"}
                    </span>
                  </p>
                  <p>
                    <FontAwesomeIcon
                      icon={faClock}
                      className="mr-3 h-4"
                    ></FontAwesomeIcon>
                    <span className="my-auto">
                      {trip.duration < 60
                        ? moment
                            .duration(trip.duration, "minutes")
                            .format("m") +
                          (moment
                            .duration(trip.duration, "minutes")
                            .format("m") === "1"
                            ? " minute"
                            : " minutes")
                        : moment
                            .duration(trip.duration, "minutes")
                            .format("h") +
                          (moment
                            .duration(trip.duration, "minutes")
                            .format("h") === "1"
                            ? " hour"
                            : " hours")}
                    </span>
                  </p>
                </div>
                {trip.arrival !== undefined ? (
                  <>
                    <p className="leading-tight font-semibold truncate">
                      <span className="text-xl">
                        {trip.arrival.name + ", " + trip.arrival.city}
                      </span>{" "}
                      <br></br>
                      <span className="tracking-tighter text-gray-600 font-light font-mono ml-2">
                        {String(trip.arrival.time.getHours()).padStart(2, "0") +
                          ":" +
                          String(trip.arrival.time.getMinutes()).padStart(
                            2,
                            "0"
                          ) +
                          " " +
                          String(trip.arrival.time.getDate()).padStart(2, "0") +
                          "." +
                          String(trip.arrival.time.getMonth() + 1).padStart(
                            2,
                            "0"
                          ) +
                          "." +
                          String(trip.arrival.time.getFullYear())}

                        {trip.arrival.platform !== undefined ? (
                          <>
                            <span className="uppercase tracking-wide">
                              {" | " +
                                trip.arrival.platform.type +
                                " " +
                                trip.arrival.platform.name}
                            </span>
                          </>
                        ) : (
                          <></>
                        )}
                      </span>
                    </p>
                  </>
                ) : (
                  <></>
                )}
                <hr className="mt-6 mb-3 border-gray-700"></hr>
                <div className="mb-3">
                  {trip.nodes.map((node, index) => (
                    <div>
                      <div className="flex justify-between">
                        <div className="flex">
                          <img
                            style={
                              this.state.imageError
                                ? { display: "hidden", marginRight: "0" }
                                : {
                                    height: "24px",
                                    marginRight: "0.5rem"
                                  }
                            }
                            className="my-2 w-auto"
                            src={
                              typeof node.line === "string" &&
                              node.line.includes("U") &&
                              !node.mode
                                ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                                : node.mode.title.includes("taxi")
                                ? "https://www.dvb.de/assets/img/trans-icon/transport-alita.svg"
                                : node.mode.iconUrl
                            }
                            onError={() => {
                              this.setState({ imageError: true });
                            }}
                          />
                          <div className="w-48 leading-tight my-auto">
                            <span className="font-semibold truncate mr-1">
                              {node.line === "" ? node.mode.title : node.line}
                            </span>
                            <span className="truncate">
                              {node.direction !== "" ? (
                                <>
                                  <br></br> {node.direction}
                                </>
                              ) : node.arrival ? (
                                <>
                                  <br></br>
                                  {node.arrival.name}
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="my-auto whitespace-no-wrap text-gray-600 tracking-wide mr-4">
                          {node.duration} min
                        </p>
                      </div>
                      {node.departure !== undefined &&
                      node.arrival !== undefined ? (
                        <div
                          style={{ marginLeft: "0.63rem" }}
                          className="border-l-2 border-gray-700 mt-1 mb-1 pl-6 pt-1 pb-2 text-gray-500 leading-tight"
                        >
                          <>
                            <h3 className="text-gray-500 mb-1">
                              {node.departure.name + ", " + node.departure.city}
                              {node.stops.length > 0 ? (
                                <p className="uppercase font-mono tracking-wide font-bold text-sm text-gray-600">
                                  {String(
                                    node.departure.time.getHours()
                                  ).padStart(2, "0") +
                                    ":" +
                                    String(
                                      node.departure.time.getMinutes()
                                    ).padStart(2, "0") +
                                    String(
                                      node.stops[0].platform !== undefined
                                        ? " | " +
                                            node.stops[0].platform.type +
                                            " " +
                                            node.stops[0].platform.name
                                        : ""
                                    )}
                                </p>
                              ) : (
                                <></>
                              )}
                            </h3>
                            <h3 className="text-gray-500">
                              {node.arrival.name + ", " + node.arrival.city}
                              {node.stops.length > 0 &&
                              typeof node.stops[node.stops.length - 1]
                                .platform !== "undefined" ? (
                                <p className="uppercase font-mono tracking-wide font-bold text-sm text-gray-600">
                                  {String(
                                    node.arrival.time.getHours()
                                  ).padStart(2, "0") +
                                    ":" +
                                    String(
                                      node.arrival.time.getMinutes()
                                    ).padStart(2, "0") +
                                    " | " +
                                    node.stops[node.stops.length - 1].platform
                                      .type +
                                    " " +
                                    node.stops[node.stops.length - 1].platform
                                      .name}
                                </p>
                              ) : (
                                <></>
                              )}
                            </h3>
                          </>
                        </div>
                      ) : index !== trip.nodes.length - 1 ? (
                        <div
                          style={{ marginLeft: "0.63rem" }}
                          className="border-l-2 border-gray-700 mt-1 mb-1 pl-6 pt-1 pb-2 text-gray-500 leading-tight"
                        ></div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default Index;
