import axios from "axios";
import { getToken } from "./auth";

export const uploadImage = (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("token", token);
  formData.append("file", file);
  return new Promise((resolve, reject) => {
    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      })
      .then((response) => {
        if (response.data.error) reject(response.data.error);
        else resolve(response.data);
      })
      .catch((error) => {
        reject({
          code: -1,
          message: error.message,
        });
      });
  });
};
