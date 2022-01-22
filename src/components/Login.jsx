import React from "react";
import "./Login.css";
import { login, setToken } from "../data/auth";
import { setStoragedData } from "../data/localStorage";
import { getData, isDev } from "../data/database";

const Login = ({ theme, language, onChildAction }) => {
  const onSubmit = (e) => {
    e.preventDefault();

    const message = document.querySelector("#login-message");
    if (isDev)
      getData()
        .then((data) => {
          setToken("TOKEN");
          setStoragedData(data);
          const dataLanguage = data.find((d) => d.language.code === language);
          onChildAction({ data: dataLanguage ? dataLanguage : data[0] });
        })
        .catch((error) => {
          message.textContent = "error.message";
        });
    else {
      const email = document.querySelector("#login-email").value;
      const pass = document.querySelector("#login-pass").value;
      login(email, pass)
        .then((result) => {
          setToken(result.user.token);
          setStoragedData(result.data);
          const dataLanguage = result.data.find(
            (d) => d.language.code === language
          );
          onChildAction({ data: dataLanguage ? dataLanguage : result.data[0] });
        })
        .catch((error) => {
          message.textContent = error.message;
          console.log(error.message);
        });
    }
  };

  return (
    <div id="login" className={`${theme !== "dark" ? "" : theme}`}>
      <div className="container">
        <div id="login-message">ERROR</div>
        <form onSubmit={onSubmit}>
          <input id="login-email" type="email" placeholder="E-MAILS" />
          <br />
          <input id="login-pass" type="password" placeholder="SENHA" />
          <br />
          <input type="submit" value={"Entrar"} />
        </form>
      </div>
    </div>
  );
};

export default Login;
