import "react";
import "bulma";
import "../scss/bulma.scss";
import { geolocated } from "react-geolocated";
import * as dvb from "dvbjs";
import Router from "next/router";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRedoAlt,
  faArrowLeft,
  faMapMarkerAlt,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import DepartureCollection from "../src/components/DepartureCollection";
import DeparturePlaceholder from "../src/components/DeparturePlaceholder";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.departureCollection = React.createRef();
    this.state = {
      stopSuggestion: "",
      stopInput: "",
      departures: "",
      stopName: "",
      locationSuggestions: "",
      loading: true,
      error: "",
      placeholder: false,
      latitude: "",
      longitude: ""
    };
  }

  componentDidMount = async () => {
    if (this.props.url.query.stop) {
      this.departureCollection.current.getDepartures(this.props.url.query.stop);
      return;
    } else {
      this.getLocation();
    }
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

      stops.stops.forEach(stop => {
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

  locationSuggestionClickEvent = async event => {
    event.persist();
    await this.setState({
      stopSuggestion: ""
    });
    this.prepareForDepartures(event.target.innerHTML);
  };

  suggestionClickEvent = async event => {
    event.persist();
    await this.setState({
      stopSuggestion: ""
    });
    this.prepareForDepartures(event.target.innerHTML, false);
  };

  getStopEvent = async event => {
    var value = await event.target.value;
    await this.setState({ stopInput: value });

    if (value.length > 2) {
      await this.getStop(value);
      return;
    } else {
      this.setState({ stopSuggestion: "" });
    }
  };

  searchClickEvent = async event => {
    if (this.state.stopInput !== "") {
      this.prepareForDepartures(this.state.stopInput, true);
    }
  };

  getStop = async query => {
    dvb.findStop(query).then(async result => {
      if (result.length > 0) {
        var results = [];
        for (var i = 0; i < result.length; i++) {
          if (i < 7) {
            await results.push(
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

  updateStopName = stopName => {
    this.setState({ stopName: stopName });
    this.departureCollection.current.updateStopName(stopName);
  };

  setPlaceholder = placeholder => {
    this.setState({ placeholder: placeholder });
  };

  updateLoading = loading => {
    this.setState({ loading: loading });
    this.departureCollection.current.updateLoading(loading);
  };

  setError = err => {
    this.setState({ error: err });
  };

  setCoords = (latitude, longitude) => {
    this.setState({ latitude: latitude, longitude: longitude });
  };

  reloadDepartures = () => {
    this.departureCollection.current.reloadDepartures();
  };

  prepareForDepartures = async (stop, search) => {
    if (search) {
      dvb.findStop(stop).then(result => {
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

  render() {
    return (
      <div>
        {this.state.error ? (
          <div class="modal is-active">
            <div class="modal-background" />
            <div class="modal-content">
              <div className="box">
                <p className="title">Error</p>
                <p className="subtitle">{this.state.error}</p>
                <div className="field is-grouped">
                  <p className="control">
                    <a className="button">
                      <span
                        className="icon is-small"
                        onClick={() => Router.back()}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </span>
                    </a>
                  </p>
                  <p className="control">
                    <a className="button" href="/">
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faHome} />
                      </span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <Head>
          {this.state.stopName === "" ? (
            <title>Public Transport Monitor</title>
          ) : (
            <title>{this.state.stopName}</title>
          )}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
        </Head>
        <section className="section">
          <div className="container">
            <h1 className="title">
              {this.state.loading ? (
                "███████████"
              ) : this.state.stopName ? (
                <div>
                  <a
                    href={
                      "https://maps.apple.com/?dirflg=w&daddr=" +
                      this.state.latitude +
                      "," +
                      this.state.longitude
                    }
                  >
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      style={{ color: "#363636" }}
                    />
                  </a>{" "}
                  <a
                    style={{ color: "#363636" }}
                    href={
                      "https://maps.apple.com/?dirflg=w&daddr=" +
                      this.state.latitude +
                      "," +
                      this.state.longitude
                    }
                  >
                    {this.state.stopName}
                  </a>
                </div>
              ) : (
                "Public Transport Monitor"
              )}
            </h1>

            {!this.state.loading && !this.state.stopName ? (
              <h2 className="subtitle">Find your departure.</h2>
            ) : this.state.loading ? (
              "████████████"
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
                  <div className="dropdown is-active">
                    <div
                      className="field has-addons"
                      style={{ marginBottom: "0" }}
                    >
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
                          <FontAwesomeIcon icon={faSearch} />
                        </a>
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

          <DepartureCollection
            ref={this.departureCollection}
            modes={this.state.modes}
            stopName={this.state.stopName}
            locationSuggestions={this.state.locationSuggestions}
            loading={this.state.loading}
            updateLoading={this.updateLoading}
            updateStopName={this.updateStopName}
            setPlaceholder={this.setPlaceholder}
            setError={this.setError}
            setCoords={this.setCoords}
          />
          {this.state.loading ? (
            <div className="container">
              <hr />
            </div>
          ) : (
            ""
          )}
          {this.state.placeholder && this.props.url.query.stop ? (
            <DeparturePlaceholder />
          ) : (
            ""
          )}
        </section>
      </div>
    );
  }
}

export default geolocated({
  userDecisionTimeout: 5000
})(Index);
