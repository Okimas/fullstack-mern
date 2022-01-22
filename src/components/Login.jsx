import React from "react";
import { login } from "../data/auth";
import { getData } from "../data/database";
import "./Login.css";

const Login = ({ theme, language, onChildAction }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    const message = document.querySelector("#login-message");
    const email = document.querySelector("#login-email").value;
    const pass = document.querySelector("#login-pass").value;
    login(email, pass)
      .then((data) => {
        onChildAction({ data });
      })
      .catch((error) => {
        message.textContent = error.message;
        // delete this code
        getData("token")
          .then((data) => {
            console.log("A", data);
            const dataByLanguage = data.find(
              (d) => d.language.code === language
            );
            onChildAction({
              data: dataByLanguage,
              settings: {
                theme:
                  dataByLanguage && dataByLanguage.theme
                    ? dataByLanguage.theme
                    : theme,
                language,
              },
              component: null,
            });
          })
          .catch((error) => {});
      });
  };

  return (
    <div id="login" className={`${theme !== "dark" ? "" : theme}`}>
      <div>
        <form onSubmit={onSubmit}>
          <input id="login-email" type="email" placeholder="E-MAILS" />
          <br />
          <input id="login-pass" type="password" placeholder="SENHA" />
          <br />
          <input type="submit" value={"Entrar"} />
        </form>
      </div>
      <div id="login-message">ERROR</div>
    </div>
  );
};

export default Login;
