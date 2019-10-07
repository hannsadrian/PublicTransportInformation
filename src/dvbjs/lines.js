import axios, { AxiosRequestConfig } from "axios";
import * as utils from "./utils";

function parseDirection(direction) {
  return direction.Name;
}

function parseLine(line) {
  return {
    name: line.Name,
    mode: utils.parseMode(line.Mot),
    diva: utils.parseDiva(line.Diva),
    directions: line.Directions.map(parseDirection),
  };
}
/**
 * get a list of availible tram/bus lines for a stop.
 * @param stopID the stop ID
 */
export function lines(stopID) {
  const options = {
    url: "https://webapi.vvo-online.de/stt/lines",
    params: {
      format: "json",
      stopid: stopID,
    },
    timeout: 5000,
  };

  return axios(options)
    .then((response) => {
      // check status of response
      utils.checkStatus(response.data);

      if (response.data.Lines) {
        return response.data.Lines.map(parseLine);
      }

      return [];
    })
    .catch(utils.convertError);
}
