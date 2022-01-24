import axios from "axios";
import { getToken } from "./auth";

export const sendMessage = (email, subject, message) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/email", { token: getToken(), email, subject, message })
      .then((response) => {
        if (response.data.error) reject(response.data.error);
        else resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
