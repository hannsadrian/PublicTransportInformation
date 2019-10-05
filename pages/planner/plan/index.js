import "react";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../../static/tailwind.css";
import { BarLoader } from "react-spinners";

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
    this.setState({ loading: false });

    var query = this.props.originalProps.router.query;

    var origin = await dvb.findStop(query.origin);
    var destination = await dvb.findStop(query.destination);

    var time = query.time.split(":");
    var date = query.date.split(".");

    var departure = new Date();
    departure.setUTCHours(time[0]);
    departure.setUTCMinutes(time[1]);
    departure.setUTCFullYear(date[2], date[1] - 1, date[0]);
    console.log(departure);

    var route = await dvb
      .route(origin[0].id, destination[0].id, departure)
      .catch((error) => {
        this.setState({
          err: error.name + ": " + error.message,
          loading: false
        });
      });

    if (this.state.err === "") {
      console.log(route);
      this.setState({ route: route, loading: false });
    }
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

        {this.state.err === "" &&
        this.state.loading === false &&
        this.state.route !== {} &&
        this.state.route.origin ? (
          <p className="font-sans text-gray-500 leading-tight mb-5">
            {this.state.route.origin.name +
              " - " +
              this.state.route.destination.name}
          </p>
        ) : this.state.err === "" ? (
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
        ) : (
          <p className="p-1 pl-2 bg-red-600 text-gray-300 mt-4 mb-5 max-w-xs rounded font-semibold">
            {this.state.err}
          </p>
        )}
        {this.state.err === "" &&
        this.state.route.trips &&
        this.state.route.trips.length > 0 ? (
          <div>
            {this.state.route.trips.map((trip, index) => (
              <div className="p-1 pl-2 pt-3 bg-unselected text-gray-300 mt-4 max-w-xs rounded">
                {trip.departure !== undefined ? (
                  <h3 className="ml-1 font-semibold">
                    <span className="text-gray-500 font-light">
                      {String(trip.departure.time.getHours()).padStart(2, "0") +
                        ":" +
                        String(trip.departure.time.getMinutes()).padStart(
                          2,
                          "0"
                        )}
                    </span>{" "}
                    {trip.departure.name + ", " + trip.departure.city}
                  </h3>
                ) : (
                  <></>
                )}
                {trip.arrival !== undefined ? (
                  <>
                    <h3 className="ml-1 font-semibold">
                      <span className="text-gray-500 font-light">
                        {String(trip.arrival.time.getHours()).padStart(2, "0") +
                          ":" +
                          String(trip.arrival.time.getMinutes()).padStart(
                            2,
                            "0"
                          )}
                      </span>{" "}
                      {trip.arrival.name + ", " + trip.arrival.city}
                    </h3>
                    <hr className="mt-2 mb-3 ml-1 mr-3 border-gray-700"></hr>
                  </>
                ) : (
                  <></>
                )}
                {trip.nodes.map((node, index) => (
                  <div className="mb-5">
                    <div className="flex justify-between my-2">
                      <div className="flex">
                        <img
                          style={
                            this.state.imageError
                              ? { display: "hidden", marginRight: "0" }
                              : {
                                  height: "24px",
                                  marginRight: "0.5rem",
                                  marginLeft: "0.5rem"
                                }
                          }
                          className="my-auto w-auto"
                          src={
                            typeof node.line === "string" &&
                            node.line.includes("U") &&
                            node.mode.title.includes("undefined")
                              ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                              : node.mode.icon_url
                          }
                          onError={() => {
                            this.setState({ imageError: true });
                          }}
                        />
                        <div className="w-48 leading-tight">
                          <p className="font-semibold truncate mr-1">
                            {node.line === "" ? node.mode.title : node.line}
                          </p>
                          <p className="truncate">{node.direction}</p>
                        </div>
                      </div>
                      <p className="my-auto whitespace-no-wrap text-gray-600 tracking-wide mr-4">
                        {node.duration} min
                      </p>
                    </div>
                    {node.departure !== undefined &&
                    node.arrival !== undefined ? (
                      <div className="border-l-2 border-gray-700 pl-2 ml-2 text-gray-500 leading-tight">
                        <h3 className="text-gray-400 mb-2">
                          {node.departure.name + ", " + node.departure.city}
                          {node.stops.length > 0 &&
                          typeof node.stops[0].platform !== "undefined" ? (
                            <p className="uppercase tracking-wide font-bold text-xs text-gray-600">
                              {String(node.departure.time.getHours()).padStart(
                                2,
                                "0"
                              ) +
                                ":" +
                                String(
                                  node.departure.time.getMinutes()
                                ).padStart(2, "0") +
                                " | " +
                                node.stops[0].platform.type +
                                " " +
                                node.stops[0].platform.name}
                            </p>
                          ) : (
                            <></>
                          )}
                        </h3>
                        <h3 className="text-gray-400">
                          {node.arrival.name + ", " + node.arrival.city}
                          {node.stops.length > 0 &&
                          typeof node.stops[node.stops.length - 1].platform !==
                            "undefined" ? (
                            <p className="uppercase tracking-wide font-bold text-xs text-gray-600">
                              {String(node.arrival.time.getHours()).padStart(
                                2,
                                "0"
                              ) +
                                ":" +
                                String(node.arrival.time.getMinutes()).padStart(
                                  2,
                                  "0"
                                ) +
                                " | " +
                                node.stops[node.stops.length - 1].platform
                                  .type +
                                " " +
                                node.stops[node.stops.length - 1].platform.name}
                            </p>
                          ) : (
                            <></>
                          )}
                        </h3>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
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
