import "react";
import { geolocated } from "react-geolocated";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import "../../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Suggestions from "../../src/components/general/suggestions";
import * as dvb from "dvbjs";
import { BarLoader } from "react-spinners";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      input: ""
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: false });
  };

  redirect = async event => {
    this.setState({ loading: true });
    var stop = await dvb.findStop(event.target.id);
    if (stop.length < 1) {
      return;
    }
    Router.push("/monitor/stop/" + stop[0].id);
  };

  handleChange = event => {
    this.setState({
      input: event.target.value
    });
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport Monitor</title>
        </Head>
        <h1 className="font-semibold font-inter text-2xl text-black">
          Public Transport Monitor
        </h1>
        {!this.state.loading ? (
          <p className="font-inter text-gray-700 mb-5">Find your Departure</p>
        ) : (
          <div className="rounded-lg overflow-hidden max-w-xs pb-8 pt-2">
            <BarLoader
              heightUnit={"px"}
              height={4}
              widthUnit={"px"}
              width={330}
              color={"#1a202c"}
              loading={this.state.loading}
            />
          </div>
        )}
        <div className="w-full sm:w-auto sm:max-w-xs">
          <div className="flex mb-3">
            <Link href="/" as="/">
              <button className="text-gray-900 bg-gray-300  sm:hover:bg-gray-300 px-4 py-3 rounded-lg mr-3 sm:hover:shadow-lg focus:outline-none z-50 relative trans-fast">
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </button>
            </Link>
            <input
              placeholder="stop"
              onChange={this.handleChange}
              className="w-full text-lg font-inter font-semibold trans-fast rounded-lg px-3 bg-gray-300  sm:hover:bg-gray-300 focus:bg-gray-300 z-50 relative text-gray-800 placeholder-gray-700 sm:hover:shadow-lg focus:shadow-lg focus:outline-none"
            ></input>
          </div>
          <div className="w-full font-semibold font-inter">
            <Suggestions
              input={this.state.input}
              suggestionClick={this.redirect}
              stopsOnly={true}
              maxResults={30}
            ></Suggestions>
          </div>
        </div>
      </div>
    );
  }
}

export default geolocated({
  userDecisionTimeout: 5000
})(Index);
