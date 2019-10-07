import axios, { AxiosRequestConfig } from "axios";
import * as utils from "./utils";

/**
 * Search for different kinds of POIs inside a given bounding box.
 * @param swlng the longitude of the south west coordinate
 * @param swlat the latitude of the south west coordinate
 * @param nelng the longitude of the north east coordinate
 * @param nelat the latitude of the north east coordinate
 * @param pinTypes array of pin types
 */
export function pins(
  swlng,
  swlat,
  nelng,
  nelat,
  pinTypes = [PIN_TYPE.stop]
) {
  const sw = utils.WGS84toWm(swlng, swlat);
  const ne = utils.WGS84toWm(nelng, nelat);

  let url = "https://www.dvb.de/apps/map/pins?showLines=true";
  pinTypes.forEach((type) => (url += `&pintypes=${type}`));
  const options = {
    url,
    params: {
      swlng: sw[0],
      swlat: sw[1],
      nelng: ne[0],
      nelat: ne[1],
    },
    responseType: "text",
    timeout: 5000,
  };

  return axios(options)
    .then((response) => {
      return response.data || [];
    })
    .then((elements) => elements.map((elem) => utils.parsePin(elem)));
}
