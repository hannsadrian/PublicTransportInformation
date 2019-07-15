import "react";
import * as dvb from "dvbjs";
import Departure from "./Departure";

export default class DepartureCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stopName: "",
      departures: [],
      modes: [],
      availableModes: 0,
      modeButtons: [],
      loading: false,
      error: ""
    };
  }

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

  updateStopName = (stopName) => {
    this.setState({ stopName: stopName });
  };

  updateLoading = (loading) => {
    this.setState({ loading: loading });
  };

  getDepartures = async (stop, loading = true, removeDepartures = true) => {
    if (!removeDepartures) {
      this.props.updateLoading(loading);
    } else {
      this.setState({ departures: "" });
      this.props.updateLoading(loading);
    }

    dvb.findStop(stop).then((result) => {
      if (result.length < 1 || !result) {
        this.setState({ error: "No valid stop found", loading: false });
        return;
      }
      dvb.monitor(result[0].id, 0, 15).then((fetched) => {
        this.setState({
          stopInput: "",
          stopName: result[0].name + ", " + result[0].city
        });
        this.props.updateStopName(this.state.stopName);

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
              <div className="control">
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
              <div className="control">
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
              <Departure
                departure={departure}
                img={
                  departure.mode.icon_url ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                }
                modes={this.state.modes}
              />
            );
          }
        });

        this.setState({ modeButtons: modeButtons });

        this.setState({ departures: departures, loading: false });
        this.props.updateLoading(false);
      });
    });
  };

  render() {
    return (
      <div>
        <div className="container">
          {this.state.availableModes > 1 && !this.props.loading ? (
            <div>
              <hr />
              <div className="container">
                <div className="field is-grouped is-grouped-multiline">
                  {this.state.modeButtons}
                </div>
              </div>
              <hr />
            </div>
          ) : (
            <hr />
          )}
        </div>
        <div className="container">
          {!this.props.stopName ? (
            <div>{this.props.locationSuggestions}</div>
          ) : (
            <div />
          )}
        </div>
        <div className="container">{this.state.departures}</div>
      </div>
    );
  }
}
