import "react";
import "bulma";
import { randomBytes } from "crypto";
import { geolocated } from "react-geolocated";
import * as dvb from "dvbjs";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faRedoAlt } from "@fortawesome/free-solid-svg-icons";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stopSuggestion: "",
      stopInput: "",
      departures: "",
      stopName: "",
      locationSuggestions: "",
      loading: true,
      error: "",
      availableModes: 0,
      modes: [],
      modeButtons: []
    };
  }

  componentDidMount = async () => {
    if (this.props.url.query.stop) {
      this.getDepartures(this.props.url.query.stop);
      return;
    }
    await this.getLocation();
    this.setState({ loading: false });
  };

  getLocation = async () => {
    if (!this.props.coords) {
      setTimeout(this.getLocation, 100);
      return;
    }
    if (this.props.isGeolocationAvailable && this.props.isGeolocationEnabled) {
      var stops = await dvb.findAddress(
        this.props.coords.longitude,
        this.props.coords.latitude
      );

      var locationSuggestions = [];

      stops.stops.forEach((stop) => {
        locationSuggestions.push(
          <div key={stop.name} className="card" style={{ maxWidth: "800px" }}>
            <header className="card-header">
              <p
                style={{ cursor: "pointer" }}
                onClick={this.locationSuggestionClickEvent}
                id={stop.name}
                className="card-header-title"
              >
                {stop.name}, {stop.city}
              </p>
            </header>
          </div>
        );
      });

      this.setState({ locationSuggestions: locationSuggestions });
    }
  };

  locationSuggestionClickEvent = async (event) => {
    event.persist();
    await this.setState({
      stopSuggestion: ""
    });
    this.prepareForDepartures(event.target.innerHTML);
  };

  suggestionClickEvent = async (event) => {
    event.persist();
    await this.setState({
      stopSuggestion: ""
    });
    this.prepareForDepartures(event.target.innerHTML, false);
  };

  getStopEvent = async (event) => {
    var value = await event.target.value;
    await this.setState({ stopInput: value });

    if (value.length > 2) {
      await this.getStop(value).then((response) => {
        this.setState({ stopSuggestion: response });
      });
      return;
    }

    this.setState({ stopSuggestion: "" });
  };

  searchClickEvent = async (event) => {
    if (this.state.stopInput !== "") {
      this.prepareForDepartures(this.state.stopInput, true);
    }
  };

  getStop = async (query) => {
    dvb.findStop(query).then((result) => {
      if (result.length > 0) {
        var results = [];
        for (var i = 0; i < result.length; i++) {
          if (i < 3) {
            results.push(
              <a
                key={result[i].name + ", " + result[i].city}
                className="dropdown-item"
                onClick={this.suggestionClickEvent}
              >
                {result[i].name + ", " + result[i].city}
              </a>
            );
          }
        }
        this.setState({ stopSuggestion: results });
      } else {
        this.setState({ stopSuggestion: "" });
      }
    });
  };

  prepareForDepartures = async (stop, search) => {
    if (search) {
      dvb.findStop(stop).then((result) => {
        const href =
          "/stop/" +
          encodeURI(result[0].name + result[0].city).replace("/", "%2F");
        const as = href;
        Router.push(href, as, { shallow: true });
      });
    } else {
      const href = "/stop/" + encodeURI(stop).replace("/", "%2F");
      const as = href;
      Router.push(href, as, { shallow: true });
    }
  };

  reloadDepartures = () => {
    this.getDepartures(this.state.stopName, false);
  };

  toggleMode = async (event) => {
    event.persist();
    var modes = this.state.modes;
    var toBeToggeled = event.target.innerHTML;
    var newModes = [];

    if (!event.target.classList.contains("is-link")) {
      newModes = modes;
      newModes.push(toBeToggeled);
    } else {
      newModes = modes;
      newModes.splice(modes.indexOf(toBeToggeled), 1);
    }
    await this.setState({ modes: newModes });

    event.target.classList.toggle("is-link");
    event.target.blur();

    this.getDepartures(this.state.stopName, false, false);
  };

  getDepartures = async (stop, loading = true, removeDepartures = true) => {
    if (!removeDepartures) {
      this.setState({ loading: loading });
    } else {
      this.setState({ loading: loading, departures: "" });
    }

    dvb.findStop(stop).then((result) => {
      if (result.length < 1 || !result) {
        this.setState({ error: "No valid stop found", loading: false });
        return;
      }
      dvb.monitor(result[0].id, 0, 15).then((fetched) => {
        console.log(fetched);
        this.setState({
          stopInput: "",
          stopName: result[0].name + ", " + result[0].city
        });

        var departures = [];

        var availableModes = [];
        var modeButtons = [];
        fetched.forEach((departure) => {
          if (
            departure.mode.icon_url &&
            availableModes.indexOf(departure.mode.title) === -1
          ) {
            availableModes.push(departure.mode.title);
            modeButtons.push(
              <div class="control">
                <button className="button is-link" onClick={this.toggleMode}>
                  {departure.mode.title}
                </button>
              </div>
            );
          } else if (
            departure.mode.title === "undefined" &&
            availableModes.indexOf("U-Bahn") === -1
          ) {
            availableModes.push("U-Bahn");
            modeButtons.push(
              <div class="control">
                <button className="button is-link" onClick={this.toggleMode}>
                  U-Bahn
                </button>
              </div>
            );
          }
        });
        if (this.state.availableModes === 0) {
          this.setState({
            availableModes: availableModes.length,
            modes: availableModes,
            modeButtons: modeButtons
          });
        }

        fetched.forEach((departure) => {
          if (departure.arrivalTimeRelative >= 0) {
            departures.push(
              <div
                className="card"
                style={{
                  display: departure.mode.icon_url
                    ? this.state.modes.indexOf(departure.mode.title) !== -1
                      ? ""
                      : "none"
                    : this.state.modes.indexOf("U-Bahn") !== -1
                    ? ""
                    : "none"
                }}
                key={randomBytes(234234)}
              >
                <div className="card-content">
                  <div className="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img
                          src={
                            departure.mode.icon_url ||
                            "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                          }
                          alt="No image ._."
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">
                        <strong>{departure.line}</strong>
                      </p>
                      <p className="subtitle is-6">{departure.direction}</p>
                    </div>
                    <div className="media-right">
                      <figure
                        style={{
                          lineHeight: "46px"
                        }}
                        className="image is-42x42"
                      >
                        <span
                          style={{
                            verticalAlign: "middle"
                          }}
                          className="is-medium tag is-info"
                        >
                          {departure.arrivalTimeRelative === ""
                            ? "0"
                            : departure.arrivalTimeRelative}
                        </span>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        });

        this.setState({ modeButtons: modeButtons });

        this.setState({ departures: departures, loading: false });
      });
    });
  };

  render() {
    return (
      <div>
        <section className="section">
          <div className="container">
            <h1 className="title">
              {this.state.loading
                ? ""
                : this.state.stopName
                ? this.state.stopName
                : "Public Transport Monitor"}
            </h1>

            {this.state.error ? (
              <h2 className="subtitle">{this.state.error}</h2>
            ) : !this.state.loading && !this.state.stopName ? (
              <h2 className="subtitle">Find your departure.</h2>
            ) : (
              ""
            )}

            {!this.state.loading ? (
              <div className="field is-grouped">
                {this.state.stopName ? (
                  <p className="control">
                    <a className="button" href="/">
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faHome} />
                      </span>
                    </a>
                  </p>
                ) : (
                  ""
                )}
                {this.state.stopName ? (
                  <p className="control">
                    <button className="button" onClick={this.reloadDepartures}>
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faRedoAlt} />
                      </span>
                    </button>
                  </p>
                ) : (
                  ""
                )}
                <div className="control is-expanded">
                  <div className="dropdown is-hoverable">
                    <div className="dropdown-trigger">
                      <div className="field has-addons">
                        <div className="control is-expanded">
                          <input
                            className="input"
                            type="text"
                            placeholder="Search for a stop"
                            onChange={this.getStopEvent}
                            value={this.state.stopInput}
                            onSubmit={this.searchClickEvent}
                          />
                        </div>
                        <div className="control is-expanded">
                          <a
                            className="button is-info"
                            onClick={this.searchClickEvent}
                          >
                            Search
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className="dropdown-menu"
                      id="dropdown-menu4"
                      role="menu"
                    >
                      {this.state.stopSuggestion !== "" ? (
                        <div className="dropdown-content">
                          {this.state.stopSuggestion}
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          {this.state.availableModes > 1 && !this.state.loading ? (
            <div>
              <hr />
              <div className="container">
                <div class="field is-grouped is-grouped-multiline">
                  {this.state.modeButtons}
                </div>
              </div>
              <hr />
            </div>
          ) : (
            <hr />
          )}

          <div className="container">
            {!this.state.stopName ? (
              <div>{this.state.locationSuggestions}</div>
            ) : (
              <div />
            )}
          </div>
          <div className="container">{this.state.departures}</div>
        </section>
      </div>
    );
  }
}

export default geolocated({
  userDecisionTimeout: 5000
})(Index);
