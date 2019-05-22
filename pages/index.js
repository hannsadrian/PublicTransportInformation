import "react";
import "bulma";
import { randomBytes } from "crypto";

const fetch = require("node-fetch");

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stopSuggestion: "",
      stopInput: "",
      departures: "",
      stopName: ""
    };
  }

  getStops = event => {
    this.setState({ stopInput: event.target.value });

    if (event.target.value === "") {
      this.setState({ stopSuggestion: "" });
      return;
    }

    fetch(
      "http://widgets.vvo-online.de/abfahrtsmonitor/Haltestelle.do?hst=" +
        event.target.value,
      {
        method: "get",
        mode: "cors"
      }
    )
      .then(res => res.json())
      .then(json => {
        if (json.length > 0) {
          this.setState({ stopSuggestion: json[1][0][0] });
        }
      });
  };

  getDepartures = () => {
    fetch(
      "http://widgets.vvo-online.de/abfahrtsmonitor/Haltestelle.do?hst=" +
        this.state.stopInput,
      {
        method: "get",
        mode: "cors"
      }
    )
      .then(res => res.json())
      .then(json => {
        if (json.length > 0) {
          this.setState({ stopName: json[1][0][0] + ", " + json[0][0][0] });
        }
      });
    fetch(
      "http://widgets.vvo-online.de/abfahrtsmonitor/Abfahrten.do?hst=" +
        this.state.stopInput.replace(/&nbsp;/g, "%20"),
      { method: "get", mode: "cors" }
    )
      .then(res => res.json())
      .then(json => {
        if (json.length > 0) {
          var departures = [];
          this.setState({ stopInput: "" });
          json.forEach(departure => {
            departures.push(
              <div className="card" key={randomBytes(234234)}>
                <div className="card-content">
                  <div className="content">
                    <strong>{departure[0]}</strong> {departure[1]}
                    <span className="is-pulled-right tag is-info">
                      {departure[2] === "" ? "0" : departure[2]}
                    </span>
                  </div>
                </div>
              </div>
            );
          });
          this.setState({ departures: departures });
        }
      });
  };

  suggestionClick = event => {
    this.setState({ stopSuggestion: "", stopInput: event.target.innerHTML });
    this.getDepartures();
  };

  render() {
    return (
      <div>
        <section className="section">
          <div className="container">
            <h1 className="title">
              {this.state.stopName ? this.state.stopName : "VVO Monitor"}
            </h1>
            {!this.state.stopName ? (
              <h2 className="subtitle">
                This is a simple web page to get departures of a stop which is
                part of the Verkehrsverbund Oberelbe.
              </h2>
            ) : (
              <h2 />
            )}
            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      type="text"
                      placeholder="Search for a stop"
                      onChange={this.getStops}
                      value={this.state.stopInput}
                      onSubmit={this.getDepartures}
                    />
                  </div>
                  <div className="control is-expanded">
                    <a className="button is-info" onClick={this.getDepartures}>
                      Search
                    </a>
                  </div>
                </div>
              </div>
              <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                {this.state.stopSuggestion != "" ? (
                  <div className="dropdown-content">
                    <a className="dropdown-item" onClick={this.suggestionClick}>
                      {this.state.stopSuggestion}
                    </a>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
          <hr />
          <div className="container">{this.state.departures}</div>
        </section>
      </div>
    );
  }
}
