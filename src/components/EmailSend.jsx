import React, { useState } from "react";
import "./EmailSend.css";
import logoBlack from "../assets/images/logo-black.png";
import logoWhite from "../assets/images/logo-white.png";
import icons from "../assets/icons.svg";
import { isValidEmail } from "../utils/utils";
import { sendMessage } from "../data/email";
import Loading from "./Loading";
import { Dialog } from "./Dialog";

const EmailSend = ({ theme, language, onChildAction }) => {
  const [working, setWorking] = useState(false);
  const [dialog, setDialog] = useState(null);

  const onInput = (e) => {
    document.querySelector("#email-status").textContent = "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const status = document.querySelector("#email-status");
    const emailTo = document.querySelector("#email-to").value;
    const subject = document.querySelector("#email-subject").value;
    const message = document.querySelector("#email-message").value;
    if (isValidEmail(emailTo) && message.trim().length > 1) {
      setWorking(true);
      sendMessage(emailTo, subject, message)
        .then((response) => {
          console.log(response);
          setDialog({
            title: "Success!",
            message: "E-mail sent",
            buttons: [
              {
                label: "OK",
                onClick: () => {
                  setDialog(null);
                },
              },
            ],
            onClose: () => {
              setDialog(null);
            },
          });
        })
        .catch((error) => {
          console.log(error);
          setDialog({
            title: "Error!",
            message: error.message,
            buttons: [
              {
                label: "OK",
                onClick: () => {
                  setDialog(null);
                },
              },
            ],
            onClose: () => {
              setDialog(null);
            },
          });
        })
        .finally(() => {
          setWorking(false);
        });
    } else status.textContent = "Invalid e-mail/message";
  };

  return (
    <div id="email" className={`${theme !== "dark" ? "" : theme}`}>
      <div id="email-close" onClick={() => onChildAction({ component: null })}>
        <svg width="16" height="16">
          <use xlinkHref={`${icons}#close`} />
        </svg>
      </div>
      <div className="container">
        <header>
          <img
            className="logo"
            src={theme === "dark" ? logoWhite : logoBlack}
            alt="logo"
          />
          <div className="title">MERN Project</div>
          <div className="subtitle">E-mail integration</div>
          <div className="text">
            This tool uses your Gmail (setted in ".env" file) to send e-mails.
            As an application example, automatic confirmation emails to new
            users registration.
          </div>
        </header>
        <main>
          <div id="email-status"></div>
          <form onSubmit={onSubmit}>
            <input
              id="email-to"
              type="email"
              placeholder="e-mail"
              onInput={onInput}
            />
            <input
              id="email-subject"
              type="text"
              placeholder="subject"
              onInput={onInput}
            />
            <textarea
              name=""
              id="email-message"
              rows="5"
              placeholder="your message"
            ></textarea>
            <div className="btn-container">
              <input type="submit" value={"Send"} className="rounded" />
            </div>
          </form>
        </main>
      </div>
      {working && (
        <Loading
          theme={theme}
          message={language === "pt-BR" ? "Enviando..." : "Sending..."}
        />
      )}
      {dialog && (
        <Dialog
          title={dialog.title}
          message={dialog.message}
          buttons={dialog.buttons}
          onClose={dialog.onClose}
        />
      )}
    </div>
  );
};

export default EmailSend;
