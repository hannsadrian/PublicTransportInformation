import "react";
import { geolocated } from "react-geolocated";
import * as dvb from "dvbjs";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import "../../static/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Offline, Online } from "react-detect-offline";
import {
  faHome,
  faRedoAlt,
  faArrowLeft,
  faMapMarkerAlt,
  faSearch,
  faBus
} from "@fortawesome/free-solid-svg-icons";

class Index extends React.Component {
  render() {
    return (
      <div className="p-8 sm:p-20">
        <p>hi</p>
      </div>
    );
  }
}

export default Index;
