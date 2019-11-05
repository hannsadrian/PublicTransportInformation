import "react";
import Head from "next/head";
import Link from "next/link";
import "../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBusAlt,
  faMapSigns
} from "@fortawesome/free-solid-svg-icons";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(err => console.error("Service worker registration failed", err));
    } else {
      console.log("Service worker not supported");
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport</title>
        </Head>
        <h1 className="font-bold font-inter text-2xl text-black">
          Public Transport
        </h1>
        <p className="font-inter mb-5 text-gray-700">Choose wiseley...</p>
        <div className="w-full sm:w-auto sm:max-w-xs mb-6">
          <Link href="/monitor" as="/monitor">
            <a>
              <div className="sm:hover:shadow-lg sm:hover:bg-gray-300 trans w-full bg-gray-300 sm:bg-gray-400 font-medium font-inter rounded-lg overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex flex-shrink justify-between">
                <div className="w-3/4">
                  <p className="font-semibold text-xl flex items-center">
                    <FontAwesomeIcon icon={faBusAlt}></FontAwesomeIcon>
                    <span className="truncate mt-1 ml-2 text-gray-900">
                      Monitor
                    </span>
                  </p>
                  <p className="font-normal truncate text-gray-700">
                    Find your departure
                  </p>
                </div>

                <div className="w-1/4 sm:w-1/5 md:w-1/6 p-3 object-right trans">
                  <p className="font-semibold text-right text-2xl text-gray-900">
                    <FontAwesomeIcon
                      style={{ height: "21px" }}
                      icon={faArrowRight}
                    ></FontAwesomeIcon>
                  </p>
                </div>
              </div>
            </a>
          </Link>
          <Link href="/planner" as="/planner">
            <a>
              <div className="sm:hover:shadow-lg sm:hover:bg-gray-300 trans w-full bg-gray-300 sm:bg-gray-400 font-medium font-inter rounded-lg overflow-hidden mb-2 sm:mb-3 p-2 pl-3 flex flex-shrink justify-between">
                <div className="w-3/4">
                  <p className="font-semibold text-xl flex items-center">
                    <FontAwesomeIcon icon={faMapSigns}></FontAwesomeIcon>
                    <span className="truncate mt-1 ml-2 text-gray-900">
                      Planner
                    </span>
                  </p>
                  <p className="font-normal truncate text-gray-700">
                    Where do you want to go?
                  </p>
                </div>

                <div className="w-1/4 sm:w-1/5 md:w-1/6 p-3 object-right trans">
                  <p className="font-semibold text-right text-2xl text-gray-900">
                    <FontAwesomeIcon
                      style={{ height: "21px" }}
                      icon={faArrowRight}
                    ></FontAwesomeIcon>
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    );
  }
}

export default Index;
