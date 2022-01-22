import React, { Component } from "react";
import "./App.css";
import backgroundLinght from "./assets/images/background-light.jpg";
import backgroundDark from "./assets/images/background-dark.jpg";
import Login from "./components/Login";
import ImageViewer from "./components/ImageViewer";
import Loading from "./components/Loading";
import Scene from "./components/Scene";
import { getStoragedData, getStoragedToken } from "./data/localStorage";
import { getData } from "./data/database";

class App extends Component {
  state = {
    component: null,
    data: null,
    sectionActive: 0,
    settings: {
      theme: "light",
      language: "pt-BR",
    },
  };

  sectionsHeights;
  timer;

  init = () => {
    this.windowResize();
    window.addEventListener("resize", this.windowResize, false);
    window.addEventListener("keydown", this.onKeyDown, false);
    document
      .querySelector("#app main")
      .addEventListener("scroll", this.onMainScroll, false);
    document.querySelector("#app .background-image").classList.add("loaded");
    if (document.querySelector("#app .section-background-image"))
      document
        .querySelector("#app .section-background-image")
        .classList.add("loaded");
  };

  windowResize = () => {
    this.sectionsHeights = [];
    document.querySelectorAll("#app main section").forEach((section) => {
      this.sectionsHeights.push(section.offsetHeight);
    });
  };

  onMainScroll = (e) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const scrollPos = Math.ceil(e.target.scrollTop);
      let top = 0;
      let bottom = 0;
      for (let i = 0; i < this.sectionsHeights.length; i++) {
        top = bottom - (bottom === 0 ? 0 : 0.5 * this.sectionsHeights[i]);
        bottom += this.sectionsHeights[i];
        if (
          scrollPos >= top &&
          scrollPos < bottom - 0.5 * this.sectionsHeights[i]
        ) {
          this.setState({ ...this.state, sectionActive: i });
          break;
        }
      }
    }, 300);
  };

  componentDidMount() {
    const token = getStoragedToken();
    if (token) {
      getData(token)
        .then((data) => {
          const dataByLanguage = data.find(
            (d) => d.language.code === this.settings.language
          );
          this.setState({
            ...this.state,
            data: dataByLanguage,
            settings: {
              theme:
                dataByLanguage && dataByLanguage.theme
                  ? dataByLanguage.theme
                  : this.settings.theme,
              language: this.settings.language,
            },
            component: null,
          });
        })
        .catch((error) => {
          // INVALID TOKEN / ERROR
          this.setState({
            ...this.state,
            data: null,
            component: { name: "login" },
          });
        });
    } else {
      this.setState({
        ...this.state,
        data: null,
        component: { name: "login" },
      });
    }
  }

  getHeightSum = (index) => {
    let heightSum = 0;
    for (let i = 0; i < this.sectionsHeights.length; i++) {
      if (i === index) break;
      heightSum += this.sectionsHeights[i];
    }
    return heightSum;
  };

  onKeyDown = (e) => {
    if (e.which === 34 || e.which === 40 || e.which === 39) {
      const newIndex = this.state.sectionActive + 1;
      if (this.sectionsHeights[newIndex]) {
        document.querySelector("#app main").scrollTop =
          this.getHeightSum(newIndex);
      }
    } else if (e.which === 33 || e.which === 38 || e.which === 37) {
      const newIndex = this.state.sectionActive - 1;
      if (this.sectionsHeights[newIndex]) {
        document.querySelector("#app main").scrollTop =
          this.getHeightSum(newIndex);
      }
    } else if (e.which === 27 && this.state.imageViewer) {
      //ESC
      this.setState({ ...this.state, component: null });
    }
  };

  onThemeChange = (theme) => {
    const state = this.state;
    state.settings.theme = theme;
    this.setState(state);
  };

  onLanguageChange = (language) => {
    const data = getStoragedData();
    if (data) {
      const dataByLanguage = data.find((d) => d.language.code === language);
      if (dataByLanguage) {
        const state = this.state;
        state.settings.language = language;
        state.data = dataByLanguage;
        this.setState(state, () => {
          this.windowResize();
          this.onMenuChange(this.state.sectionActive);
        });
      }
    }
  };

  onMenuChange = (index) => {
    document.querySelector("#app main").scrollTop = this.getHeightSum(index);
  };

  onChildAction = (object) => {
    const keys = Object.keys(object);
    const state = this.state;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      state[key] = object[key];
    }
    this.setState(state, () => this.init());
  };

  render() {
    const { settings, component, data, sectionActive } = this.state;
    return (
      <>
        {data && (
          <div
            id="app"
            className={`${settings.theme !== "dark" ? "" : settings.theme}`}
          >
            <picture
              className="background-image"
              style={{
                backgroundImage:
                  "url(" +
                  (settings.theme === "dark"
                    ? backgroundDark
                    : backgroundLinght) +
                  ")",
              }}
            />
            <header>
              <div className="options">
                <div
                  className="options-language"
                  onClick={() =>
                    this.onLanguageChange(
                      settings.language === "en" ? "pt-BR" : "en"
                    )
                  }
                >
                  {settings.language === "en" ? "português" : "english"}
                </div>
                <div
                  className="options-theme"
                  onClick={() =>
                    this.onThemeChange(
                      settings.theme === "dark" ? "light" : "dark"
                    )
                  }
                ></div>
              </div>
              <div className="title">
                <div className="name">{data.profile.name}</div>
                <div className={"hole " + settings.language}>
                  {data.profile.role}
                </div>
              </div>
              <div className="menu">
                {data.script.map((scene, index) => (
                  <div
                    key={"menu-" + index}
                    className={`item${
                      sectionActive === index ? " active" : ""
                    }`}
                    onClick={() => this.onMenuChange(index)}
                  >
                    {scene.label}
                  </div>
                ))}
              </div>
            </header>
            <main>
              {data.script.map((scene, index) => (
                <section key={"section-" + index}>
                  {scene.backgroundImage && (
                    <picture
                      className="section-background-image"
                      style={{
                        backgroundImage: "url(" + scene.backgroundImage + ")",
                      }}
                    />
                  )}
                  <div className="content">
                    <div className="content-title">{scene.label}</div>
                    <Scene
                      key={"scene-" + scene.number}
                      scene={scene}
                      onChildAction={this.onChildAction}
                    />
                  </div>
                </section>
              ))}
            </main>
          </div>
        )}
        {component && component.name === "login" && (
          <Login
            theme={settings.theme}
            language={settings.language}
            onChildAction={this.onChildAction}
          />
        )}
        {component && component.name === "imageviewer" && (
          <ImageViewer
            images={component.images}
            index={component.index}
            onChildAction={this.onChildAction}
          />
        )}
        {component && component.name === "loading" && (
          <Loading theme={settings.theme} language={settings.language} />
        )}
      </>
    );
  }
}

export default App;
