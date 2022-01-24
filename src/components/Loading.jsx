import React from "react";
import "./Loading.css";

const Loading = ({ theme, message }) => {
  return (
    <div id="loading" className={`${theme !== "dark" ? "" : theme}`}>
      <div>{message}</div>
    </div>
  );
};
export default Loading;
