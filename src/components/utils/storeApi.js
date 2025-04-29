import axios from "axios";

export default async function callApi(geturl, requestDetails) {
  return getApi(geturl, requestDetails);
}

async function getApi(geturl, requestDetails) {
  return new Promise(async (resolve, reject) => {

    const url = "https://dummyjson.com" + geturl;
    const payload = requestDetails?.payload || null;
    const method = requestDetails?.method || "GET";
    const headers = { "content-type": "application/json" };

    const config = { url, method, headers };

    if (payload) {
      config.data = payload;
    }

    try {
      const response = await axios(config);
      const data = response;
      return resolve(data);
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
    } catch (error) {
      return reject(error);
      //   throw new Error(error.message);
    }
  });
}
