import "react";
import { randomBytes } from "crypto";
var moment = require("moment");
var momentDuration = require("moment-duration-format");

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
      var formatted = "~";
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
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={this.props.img} alt="No image ._." />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">
                <strong>{this.props.departure.line}</strong>
              </p>
              <p className="subtitle is-6">{this.props.departure.direction}</p>
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
