import "react";
import { randomBytes } from "crypto";
var moment = require("moment");
var momentDuration = require("moment-duration-format");
import Router from "next/router";
import * as dvb from "dvbjs";

// Props: departure, img, modes
export default class Departure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrivalTimeRelative: ""
    };
  }

  componentDidMount = () => {
    var time =
      this.props.departure.arrivalTimeRelative === ""
        ? "0"
        : this.props.departure.arrivalTimeRelative;

    if (this.props.modes.indexOf("placeholder") === -1) {
      var formatted = moment.duration(time, "minutes").format("d[d] h[h] m[m]");
    } else {
      var formatted = " ";
    }

    this.setState({ arrivalTimeRelative: formatted });
  };

  render() {
    return (
      <div
        className="card"
        style={{
          display: this.props.departure.mode.icon_url
            ? this.props.modes.indexOf(this.props.departure.mode.title) !== -1
              ? ""
              : "none"
            : this.props.modes.indexOf("U-Bahn") !== -1
            ? ""
            : "none"
        }}
        key={randomBytes(234234)}
      >
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p
                className="title is-4"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {this.props.img ? (
                  <img
                    style={{ height: "26px", marginRight: "5px" }}
                    src={this.props.img}
                    alt=""
                    onerror="this.style.display='none'"
                  />
                ) : (
                  ""
                )}{" "}
                <strong
                  style={{
                    fontSize: "26px"
                  }}
                >
                  {this.props.departure.line}
                </strong>
              </p>
              <p className="subtitle is-6">
                <u
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dvb
                      .findStop(this.props.departure.direction)
                      .then(result => {
                        const href =
                          "/stop/" +
                          encodeURI(result[0].name + result[0].city).replace(
                            "/",
                            "%2F"
                          );
                        const as = href;
                        Router.push(href, as, { shallow: true });
                      });
                  }}
                >
                  {this.props.departure.direction}
                </u>
              </p>
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
                  {this.state.arrivalTimeRelative}
                </span>
              </figure>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
