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
import StopInformation from "../../../src/elements/planner/StopInformation";
import DepartureStopDisplay from "../../../src/elements/planner/DepartureStopDisplay";
import ArrivalStopDisplay from "../../../src/elements/planner/ArrivalStopDisplay";
import Node from "../../../src/elements/planner/Node";
import Stop from "../../monitor/stop/[stop]";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: {},
      err: "",
      loading: true,
      imageError: false,
      stop: ""
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

    /*
      Some additional parsing for beautiful displaying
    */

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

  showDepartures(event) {
    this.setState({ stop: event.target.id });
  }

  render() {
    return (
      <div className="p-6 pb-0 pt-12 sm:p-20 lg:pl-32">
        <Head>
          <title>Public Transport Planner</title>
        </Head>
        <div className="flex">
          <div className="w-full max-w-md">
            <div className="flex">
              <Link href="/planner" as="/planner">
                <button className="text-gray-900 bg-gray-300 px-4 py-3 rounded-lg mr-3 sm:hover:shadow-lg z-50 relative  sm:hover:bg-gray-300 focus:outline-none trans">
                  <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                </button>
              </Link>
              <h1 className="my-auto font-semibold font-inter text-2xl text-black">
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
                  color={"#1a202c"}
                  loading={this.state.loading}
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
              <div
                style={{ height: "80vh" }}
                className="max-w-md overflow-x-hidden overflow-scroll custom-scrollbar scrolling-touch mt-4 pb-32 rounded-lg"
              >
                {this.state.route.trips.map((trip, index) => (
                  <div
                    key={JSON.stringify(trip)}
                    className="p-1 pl-4 pr-4 pt-4 bg-gray-300 text-black mt-4 rounded-lg"
                  >
                    {trip.departure !== undefined ? (
                      <StopInformation
                        information={trip.departure}
                      ></StopInformation>
                    ) : (
                      <></>
                    )}
                    <div className="my-3 ml-2">
                      <Interchanges
                        interchanges={trip.interchanges}
                      ></Interchanges>
                      <Duration duration={trip.duration}></Duration>
                    </div>
                    {trip.arrival !== undefined ? (
                      <StopInformation
                        information={trip.arrival}
                      ></StopInformation>
                    ) : (
                      <></>
                    )}
                    <hr className="mt-6 mb-5 border-2 rounded-lg border-gray-500"></hr>
                    <div className="mb-3">
                      {trip.nodes.map((node, index) => (
                        <div key={JSON.stringify(node) + randomBytes(123)}>
                          <DepartureStopDisplay
                            node={node}
                            onClick={this.showDepartures.bind(this)}
                          ></DepartureStopDisplay>
                          <Node node={node}></Node>
                          <ArrivalStopDisplay
                            node={node}
                            trip={trip}
                            index={index}
                            onClick={this.showDepartures.bind(this)}
                          ></ArrivalStopDisplay>
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
          <Stop
            embed={true}
            originalProps={this.props.originalProps}
            stop={this.state.stop}
            closeEmbed={() => {
              this.setState({ stop: "" });
            }}
          ></Stop>
        </div>
      </div>
    );
  }
}

export default Index;
