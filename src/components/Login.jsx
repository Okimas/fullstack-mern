import React from "react";
import "./Login.css";
import logo from "../assets/images/logo-black.png";
import { login, setToken } from "../data/auth";
import { setStoragedData } from "../data/localStorage";
import { getData } from "../data/database";
import { isValidEmail } from "../utils/utils";

const Login = ({ theme, language, onChildAction }) => {
  const onInput = (e) => {
    document.querySelector("#login-status").textContent = "";
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const status = document.querySelector("#login-status");
    const email = document.querySelector("#login-email").value;
    const pass = document.querySelector("#login-pass").value;
    if (isValidEmail(email) && pass.trim().length > 4) {
      login(email, pass)
        .then((result) => {
          setToken(result.user.token);
          setStoragedData(result.data);
          const dataLanguage = result.data.find(
            (d) => d.language.code === language
          );
          onChildAction({
            data: dataLanguage ? dataLanguage : result.data[0],
          });
        })
        .catch((error) => {
          status.textContent = error.message;
          console.log(error.message);
        });
    } else status.textContent = "Invalid e-mail/password";
  };

  return (
    <div id="login" className={`${theme !== "dark" ? "" : theme}`}>
      <div className="container">
        <header>
          <img className="logo" src={logo} alt="" />
          <div className="title">MERN Project</div>
          <div className="subtitle">LogIn</div>
          <div className="text">
            As secure access, a token based login using local storage and server
            authorization middleware for each request.
            <br />
            To logIn see the readme on{" "}
            <a href="https://github.com/Okimas/fullstack-mern" target="_blank">
              GitHub MERN project
            </a>
            .
          </div>
        </header>
        <main>
          <div id="login-status"></div>
          <form onSubmit={onSubmit}>
            <input
              id="login-email"
              type="email"
              placeholder="e-mail"
              onInput={onInput}
            />
            <input
              id="login-pass"
              type="password"
              placeholder="password"
              onInput={onInput}
            />
            <div className="btn-container">
              <input type="submit" value={"LogIn"} className="rounded" />
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Login;
