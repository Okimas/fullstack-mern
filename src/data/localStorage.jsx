const DATA_KEY = "DATA_KEY";
const TOKEN_KEY = "TOKEN_KEY";

export const setStoragedToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export const getStoragedToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoragedData = (data) => {
  if (data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(DATA_KEY);
  }
};

export const getStoragedData = () => {
  const rawData = localStorage.getItem(DATA_KEY);
  if (rawData) return JSON.parse(localStorage.getItem(DATA_KEY));
  return null;
};
