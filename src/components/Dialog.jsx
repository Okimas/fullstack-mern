import React from "react";
import icons from "../assets/icons.svg";
import "./Dialog.css";

export const Dialog = ({ title, message, buttons, onClose, theme }) => {
  const closeDialog = () => {
    document.querySelector("#dialog").classList.add("hidden");
    onClose();
  };
  return (
    <div id="dialog" className={`${theme !== "dark" ? "" : theme}`}>
      <div className="close" onClick={closeDialog}>
        <svg width="16" height="16">
          <use xlinkHref={`${icons}#close`} />
        </svg>
      </div>
      <div className="wrapper">
        <div className="title">{title}</div>
        <div className="message">{message}</div>
        <div className="buttons">
          {buttons.map((button, idx) => {
            return (
              <button
                key={idx.toString()}
                // className="button"
                onClick={() => {
                  button.onClick();
                }}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
