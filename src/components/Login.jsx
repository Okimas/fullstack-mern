import React from "react";
import "./Login.css";
import logo from "../assets/images/logo-black.png";
// import logoBlack from "../assets/images/logo-black.png";
// import logoWhite from "../assets/images/logo-white.png";
import { login, setToken } from "../data/auth";
import { setStoragedData } from "../data/localStorage";
import { getData, withServer } from "../data/database";
import { isValidEmail } from "../utils/utils";

const Login = ({ theme, language, onChildAction }) => {
  const onInput = (e) => {
    document.querySelector("#login-status").textContent = "";
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const status = document.querySelector("#login-status");
    if (withServer) {
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
    } else
      getData()
        .then((data) => {
          setToken("TOKEN");
          setStoragedData(data);
          const dataLanguage = data.find((d) => d.language.code === language);
          onChildAction({ data: dataLanguage ? dataLanguage : data[0] });
        })
        .catch((error) => {
          status.textContent = "error.message";
        });
  };

  return (
    <div id="login" className={`${theme !== "dark" ? "" : theme}`}>
      <div className="container">
        <header>
          {/* <img
            className="logo"
            src={theme === "dark" ? logoWhite : logoBlack}
            alt="logo"
          /> */}
          <img className="logo" src={logo} alt="" />
          <div className="title">MERN Project</div>
          <div className="subtitle">LogIn</div>
          <div className="text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
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
