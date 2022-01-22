import React from "react";
import "./Loading.css";

const Loading = ({ theme, language }) => {
  return (
    <div id="loading" className={`${theme !== "dark" ? "" : theme}`}>
      <div>{language === "pt-BR" ? "CARREGANDO" : "LOADING"}</div>
    </div>
  );
};
export default Loading;
