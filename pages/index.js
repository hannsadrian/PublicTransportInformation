import "react";
import "bulma";
import { randomBytes } from "crypto";
import { geolocated } from "react-geolocated";
import * as dvb from "dvbjs";
import Router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

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
      error: ""
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
    await this.setState({
      stopSuggestion: ""
    });
    this.prepareForDepartures(this.state.stopInput);
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
      this.prepareForDepartures(this.state.stopInput);
    }
  };

  getStop = async (query) => {
    dvb.findStop(query).then((result) => {
      if (result.length > 0) {
        this.setState({ stopSuggestion: result[0].name });
      }
    });
  };

  prepareForDepartures = async (stop) => {
    dvb.findStop(stop).then((result) => {
      const href = "/stop/" + encodeURI(result[0].name).replace("/", "%2F");
      const as = href;
      Router.push(href, as, { shallow: true });
    });
  };

  getDepartures = async (stop) => {
    this.setState({ loading: true, departures: "" });

    dvb.findStop(stop).then((result) => {
      if (result.length < 1 || !result) {
        this.setState({ error: "No valid stop found", loading: false });
        return;
      }
      dvb.monitor(result[0].id, 0, 10).then((fetched) => {
        this.setState({
          stopInput: "",
          stopName: result[0].name + ", " + result[0].city
        });

        var departures = [];

        fetched.forEach((departure) => {
          departures.push(
            <div className="card" key={randomBytes(234234)}>
              <div className="card-content">
                <div className="content">
                  <strong>{departure.line}</strong> {departure.direction}
                  <span className="is-pulled-right tag is-info">
                    {departure.arrivalTimeRelative === ""
                      ? "0"
                      : departure.arrivalTimeRelative}
                  </span>
                </div>
              </div>
            </div>
          );
        });

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
              <h2 className="subtitle">Find your departure</h2>
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
                          <a
                            className="dropdown-item"
                            onClick={this.suggestionClickEvent}
                          >
                            {this.state.stopSuggestion}
                          </a>
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

          <hr />
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
