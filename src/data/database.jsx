import axios from "axios";
const { setStoragedData } = require("./localStorage");

export const getData = (token) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/data", { token })
      .then((response) => {
        if (response.data.error) reject(response.data.error);
        else {
          setStoragedData(response.data);
          resolve(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
