import "react";
import Departure from "./Departure";

export default class DeparturePlaceholder extends React.Component {
  render() {
    return (
      <div>
        <div className="container">
          <Departure
            departure={{
              line: "██",
              direction: "█████████",
              arrivalTimeRelative: 0,
              mode: {
                icon_url: "https://via.placeholder.com/48x48.png?text=_",
                title: "placeholder"
              }
            }}
            img={"https://via.placeholder.com/48x48.png?text=_"}
            modes={["placeholder"]}
          />
          <Departure
            departure={{
              line: "██",
              direction: "█████████",
              arrivalTimeRelative: 4,
              mode: {
                icon_url: "https://via.placeholder.com/48x48.png?text=_",
                title: "placeholder"
              }
            }}
            img={"https://via.placeholder.com/48x48.png?text=_"}
            modes={["placeholder"]}
          />
          <Departure
            departure={{
              line: "██",
              direction: "█████████",
              arrivalTimeRelative: 5,
              mode: {
                icon_url: "https://via.placeholder.com/48x48.png?text=_",
                title: "placeholder"
              }
            }}
            img={"https://via.placeholder.com/48x48.png?text=_"}
            modes={["placeholder"]}
          />
          <Departure
            departure={{
              line: "██",
              direction: "█████████",
              arrivalTimeRelative: 12,
              mode: {
                icon_url: "https://via.placeholder.com/48x48.png?text=_",
                title: "placeholder"
              }
            }}
            img={"https://via.placeholder.com/48x48.png?text=_"}
            modes={["placeholder"]}
          />
          <Departure
            departure={{
              line: "██",
              direction: "█████████",
              arrivalTimeRelative: 14,
              mode: {
                icon_url: "https://via.placeholder.com/48x48.png?text=_",
                title: "placeholder"
              }
            }}
            img={"https://via.placeholder.com/48x48.png?text=_"}
            modes={["placeholder"]}
          />
          <Departure
            departure={{
              line: "██",
              direction: "█████████",
              arrivalTimeRelative: 19,
              mode: {
                icon_url: "https://via.placeholder.com/48x48.png?text=_",
                title: "placeholder"
              }
            }}
            img={"https://via.placeholder.com/48x48.png?text=_"}
            modes={["placeholder"]}
          />
          <Departure
            departure={{
              line: "██",
              direction: "█████████",
              arrivalTimeRelative: 19,
              mode: {
                icon_url: "https://via.placeholder.com/48x48.png?text=_",
                title: "placeholder"
              }
            }}
            img={"https://via.placeholder.com/48x48.png?text=_"}
            modes={["placeholder"]}
          />
        </div>
      </div>
    );
  }
}
