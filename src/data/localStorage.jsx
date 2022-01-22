const DATA_KEY = "DATA_KEY";

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
