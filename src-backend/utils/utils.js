module.exports = {
  getLocalIP: () => {
    const networkInterfaces = require("os").networkInterfaces();
    for (const key of Object.keys(networkInterfaces)) {
      const arr = networkInterfaces[key];
      for (const item of arr) {
        if (
          "family" in item &&
          item.family === "IPv4" &&
          !item.address.startsWith("127")
        ) {
          return item.address;
        }
      }
    }
    return null;
  },
};
