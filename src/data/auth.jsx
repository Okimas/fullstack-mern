import axios from "axios";

export const TOKEN_KEY = "APP_TOKEN";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.error) reject(response.data.error);
        else {
          setToken(response.data.token);
          resolve(response.data);
        }
      })
      .catch((error) => {
        reject({
          code: -1,
          message: "Não foi possível a comunicação com o servidor!",
        });
      });
  });
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.reload();
};

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
