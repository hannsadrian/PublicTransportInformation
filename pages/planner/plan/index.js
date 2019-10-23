import "react";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../../static/tailwind.css";
import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Interchanges from "../../../src/elements/planner/interchanges";
import Duration from "../../../src/elements/planner/duration";
import { randomBytes } from "crypto";

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
      .route(origin[0].id, destination[0].id, departure, false, 30000)
      .catch(error => {
        this.setState({
          err: error.name + ": " + error.message,
          loading: false
        });
      });

    if (this.state.err === "") {
      // remove/edit unnessecary details
      await route.trips.forEach(trip => {
        trip.nodes.map((node, index) => {
          if (node.mode === undefined || trip.nodes.length === 1) {
            return;
          }
          if (node.mode.name === "StayForConnection") {
            trip.nodes.splice(index, 1);
            return;
          } else if (node.mode.name === "Footpath") {
            if (index === trip.nodes.length - 1) {
              node.departure = undefined;
            } else {
              node.arrival = undefined;
            }
            node.line = "";
            node.direction = "";
          } else if (node.mode.name === "StayInVehicle") {
            node.arrival = undefined;
            node.departure = undefined;
          }
        });
      });

      // add waiting
      await route.trips.map((trip, tripIndex) => {
        var finalNodes = [];

        trip.nodes.map((node, index) => {
          if (index === 0) {
            finalNodes.push(node);
            return;
          }

          if (
            trip.nodes[index - 1].arrival !== undefined &&
            node.departure !== undefined
          ) {
            var diffMins = Math.round(
              (((node.departure.time - trip.nodes[index - 1].arrival.time) %
                86400000) %
                3600000) /
                60000
            );
            if (diffMins > 0) {
              finalNodes.push({
                arrival: undefined,
                departure: undefined,
                direction: "",
                diva: undefined,
                duration: diffMins,
                line: "",
                mode: {
                  title: "Wartezeit",
                  name: "Waiting",
                  iconUrl: "https://m.dvb.de/img/sit.svg"
                },
                path: [],
                stops: []
              });
            }
          }
          finalNodes.push(node);
        });

        trip.nodes = finalNodes;
      });

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
            <button className="text-gray-300 bg-gray-900 px-4 my-auto h-12 w-12 mr-3 rounded-lg sm:hover:shadow-outline focus:outline-none trans">
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </button>
          </Link>
          <h1 className="font-semibold font-inter text-2xl my-auto text-gray-200">
            Public Transport Planner
          </h1>
        </div>

        {this.state.loading ? (
          <div className="rounded-lg overflow-hidden max-w-xs pb-2 pt-3">
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
          <p className="p-1 pl-2 bg-red-600 text-gray-300 mt-4 mb-5 max-w-xs rounded-lg font-semibold">
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
              <div
                key={JSON.stringify(trip)}
                className="p-1 pl-4 pr-4 pt-4 bg-gray-900 text-gray-300 mt-4 max-w-sm rounded-lg"
              >
                {trip.departure !== undefined ? (
                  <p className="leading-tight font-semibold truncate mt-2">
                    <span className="text-lg">
                      {trip.departure.name + ", " + trip.departure.city}
                    </span>{" "}
                    <br></br>
                    <span className="tracking-wide text-gray-600 font-semibold text-sm">
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
                          <span className="tracking-wide">
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
                <div className="my-3 ml-2">
                  <Interchanges interchanges={trip.interchanges}></Interchanges>
                  <Duration duration={trip.duration}></Duration>
                </div>
                {trip.arrival !== undefined ? (
                  <>
                    <p className="leading-tight font-semibold truncate">
                      <span className="text-lg">
                        {trip.arrival.name + ", " + trip.arrival.city}
                      </span>{" "}
                      <br></br>
                      <span className="tracking-wide text-gray-600 font-semibold text-sm">
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
                            <span className="tracking-wide">
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
                <hr className="mt-6 mb-5 border-2 rounded-lg border-gray-800"></hr>
                <div className="mb-3">
                  {trip.nodes.map((node, index) => (
                    <div key={JSON.stringify(node) + randomBytes(123)}>
                      {node.departure !== undefined ? (
                        <h3 className="text-gray-300 truncate mb-2 mt-2">
                          <span className="font-semibold text-sm">
                            {node.departure.name + ", " + node.departure.city}
                          </span>
                          {node.stops.length > 0 ? (
                            <p className="tracking-wide text-gray-600 font-semibold text-sm -mt-1">
                              ab{" "}
                              {String(node.departure.time.getHours()).padStart(
                                2,
                                "0"
                              ) +
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
                      ) : (
                        <></>
                      )}
                      <div
                        className={
                          (node.mode !== undefined
                            ? String(node.mode.name).includes("Footpath") ||
                              String(node.mode.name).includes("StairsUp") ||
                              String(node.mode.name).includes("StairsDown") ||
                              String(node.mode.name).includes("EscalatorUp") ||
                              String(node.mode.name).includes(
                                "EscalatorDown"
                              ) ||
                              String(node.mode.name).includes("ElevatorUp") ||
                              String(node.mode.name).includes("ElevatorDown") ||
                              String(node.mode.name).includes("Waiting") ||
                              String(node.mode.name).includes("StayInVehicle")
                              ? "bg-gray-900 text-gray-500"
                              : "bg-gray-800 text-gray-400"
                            : "bg-gray-800 text-gray-400") +
                          " rounded-lg ml-1 mr-2 pl-3 pt-2 pb-2"
                        }
                      >
                        <div className="flex justify-between">
                          <div className="flex">
                            <img
                              style={
                                this.state.imageError
                                  ? { display: "hidden", marginRight: "0" }
                                  : {
                                      height: "24px"
                                    }
                              }
                              id={node.line}
                              className="my-2 mr-2 w-auto"
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
                            <div className="w-40 leading-tight truncate my-auto text-sm">
                              {node.line === "" ? (
                                <span className="truncate mr-1">
                                  {node.mode.title}
                                </span>
                              ) : (
                                <span className="font-semibold truncate mr-1">
                                  {node.line}
                                </span>
                              )}
                              <span className="truncate">
                                {node.direction !== "" ? (
                                  <>
                                    <br></br> {node.direction}
                                  </>
                                ) : (
                                  ""
                                )}
                              </span>
                            </div>
                          </div>
                          <p className="my-auto whitespace-no-wrap text-right mr-4">
                            {node.duration} min
                          </p>
                        </div>
                      </div>
                      {(index === trip.nodes.length - 1 ||
                        index !== trip.nodes.length - 1) &&
                      node.arrival !== undefined ? (
                        <h3 className="text-gray-300 truncate mt-2 mb-2">
                          <span className="font-semibold text-sm">
                            {node.arrival.name + ", " + node.arrival.city}
                          </span>
                          {node.stops.length > 0 ? (
                            <p className="tracking-wide text-gray-600 font-semibold text-sm -mt-1">
                              an{" "}
                              {String(node.arrival.time.getHours()).padStart(
                                2,
                                "0"
                              ) +
                                ":" +
                                String(node.arrival.time.getMinutes()).padStart(
                                  2,
                                  "0"
                                ) +
                                String(
                                  node.stops[node.stops.length - 1].platform !==
                                    undefined
                                    ? " | " +
                                        node.stops[node.stops.length - 1]
                                          .platform.type +
                                        " " +
                                        node.stops[node.stops.length - 1]
                                          .platform.name
                                    : ""
                                )}
                            </p>
                          ) : (
                            <></>
                          )}
                        </h3>
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
