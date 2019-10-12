import "react";
import { geolocated } from "react-geolocated";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import "../../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Suggestions from "../../src/components/general/suggestions";

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

  redirect = event => {
    Router.push("/monitor/stop/" + event.target.id.replace("/", "%2F"));
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
        <h1 className="font-semibold font-inter text-2xl text-gray-200">
          Public Transport Monitor
        </h1>
        <p className="font-inter text-gray-500 mb-5">Find your Departure</p>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <div className="flex mb-3">
            <Link href="/" as="/">
              <button className="text-gray-300 bg-gray-900 px-4 rounded-lg mr-3 sm:hover:shadow-outline focus:outline-none trans">
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </button>
            </Link>
            <input
              placeholder="stop"
              onChange={this.handleChange}
              className="shadow w-full text-lg font-inter font-semibold trans rounded-lg px-3 py-2 hover:bg-black bg-gray-900 text-gray-200 placeholder-gray-500 focus:outline-none"
            ></input>
          </div>
          <div className="w-full bg-gray-900 text-gray-200 font-semibold font-inter rounded-lg bg-gray-900">
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
