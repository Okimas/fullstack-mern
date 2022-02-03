import React, { Component } from "react";
import "./App.css";
import icons from "./assets/icons.svg";
import backgroundBlack from "./assets/images/background-black.jpg";
import backgroundWhite from "./assets/images/background-white.jpg";
import Login from "./components/Login";
import ImageViewer from "./components/ImageViewer";
import Loading from "./components/Loading";
import Scene from "./components/Scene";
import { getStoragedData, setStoragedData } from "./data/localStorage";
import { getData } from "./data/database";
import { getToken, logout, setToken } from "./data/auth";
import EmailSend from "./components/EmailSend";
import { dataURItoBlob, getElementOffset } from "./utils/utils";
import { Dialog } from "./components/Dialog";
import { uploadImage } from "./data/upload";

class App extends Component {
  state = {
    component: null,
    data: null,
    sectionActive: 0,
    settings: {
      theme: "light",
      language: window.navigator.language,
    },
  };

  sectionsHeights;
  timer;

  init = () => {
    this.windowResize();
    window.addEventListener("resize", this.windowResize, false);
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("click", this.closeMainMenu, false);
    document
      .querySelector("#app main")
      .addEventListener("scroll", this.onMainScroll, false);
    document.querySelector("#app .background-image").classList.add("loaded");
    if (document.querySelector("#app .section-background-image"))
      document
        .querySelector("#app .section-background-image")
        .classList.add("loaded");
    document
      .querySelector("#image-file")
      .addEventListener("change", this.onImageSelection, false);
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

  onImageSelection = (e) => {
    const files = e.target.files;
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onerror = (error) => {
        this.setState({
          ...this.state,
          component: null,
          dialog: {
            title: "Error!",
            message: error.message,
            buttons: [
              {
                label: "OK",
                onClick: () => {
                  this.setState({ ...this.state, dialog: null });
                },
              },
            ],
            onClose: () => {
              this.setState({ ...this.state, dialog: null });
            },
          },
        });
      };
      fr.onloadend = () => {
        this.setState({
          ...this.state,
          component: { name: "loading", message: "sending image" },
        });
        uploadImage(dataURItoBlob(fr.result))
          .then((response) => {
            this.setState({
              ...this.state,
              dialog: {
                title: "Success!",
                message: `Image uploaded!\n[project folder] => "${response.imagePath}".\nAlso stored on Dropbox`,
                buttons: [
                  {
                    label: "OK",
                    onClick: () => {
                      this.setState({ ...this.state, dialog: null });
                    },
                  },
                ],
                onClose: () => {
                  this.setState({ ...this.state, dialog: null });
                },
              },
            });
          })
          .catch((error) => {
            this.setState({
              ...this.state,
              dialog: {
                title: "Error!",
                message: "Image was not uploaded. Error: " + error.message,
                buttons: [
                  {
                    label: "OK",
                    onClick: () => {
                      this.setState({ ...this.state, dialog: null });
                    },
                  },
                ],
                onClose: () => {
                  this.setState({ ...this.state, dialog: null });
                },
              },
            });
          })
          .finally(() => this.setState({ ...this.state, component: null }));
      };
      fr.readAsDataURL(files[0]);
    }
  };

  componentDidMount() {
    const token = getToken();
    if (token) {
      getData(token)
        .then((data) => {
          const dataByLanguage = data.find(
            (d) => d.language.code === this.state.settings.language
          );
          this.setState(
            {
              ...this.state,
              data: dataByLanguage ? dataByLanguage : data[0],
              settings: {
                theme:
                  dataByLanguage && dataByLanguage.theme
                    ? dataByLanguage.theme
                    : this.state.settings.theme,
                language: this.state.settings.language,
              },
              component: null,
            },
            () => this.init()
          );
        })
        .catch((error) => {
          // INVALID/EXPIDED TOKEN / ERROR
          console.log(">ERR", error);
          setToken();
          setStoragedData();
          this.setState({
            ...this.state,
            data: null,
            component: { name: "login" },
          });
        });
    } else
      this.setState({
        ...this.state,
        data: null,
        component: { name: "login" },
      });
  }

  getHeightSum = (index) => {
    let heightSum = 0;
    for (let i = 0; i < this.sectionsHeights.length; i++) {
      if (i === index) break;
      heightSum += this.sectionsHeights[i];
    }
    return heightSum;
  };

  closeMainMenu = (e) => {
    const menuElement = document.querySelector("#menu");
    const btnElement = document.querySelector("#app .options-menu");
    try {
      if (
        !menuElement ||
        !menuElement.classList ||
        (menuElement.classList && menuElement.classList.contains("hidden")) ||
        btnElement.contains(e.target)
      )
        return;

      const fPos = getElementOffset(menuElement);
      const fW = menuElement.offsetWidth;
      const fH = menuElement.offsetHeight;
      const insideFilter =
        e.clientX >= parseInt(fPos.left) &&
        e.clientX <= parseInt(fPos.left) + fW &&
        e.clientY >= parseInt(fPos.top) &&
        e.clientY <= parseInt(fPos.top) + fH;

      if (!insideFilter) menuElement.classList.add("hidden");
    } catch (error) {}
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
    } else if (e.which === 27) {
      //ESC
      const menuElement = document.querySelector("#menu");
      if (menuElement) menuElement.classList.add("hidden");

      if (this.state.dialog) this.setState({ ...this.state, dialog: null });
      else if (
        this.state.component &&
        (this.state.component.name === "imageviewer" ||
          this.state.component.name === "email")
      )
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
    const { settings, component, data, sectionActive, dialog } = this.state;
    return (
      <>
        {data && (
          <div
            id="app"
            className={`${settings.theme !== "dark" ? "" : settings.theme}`}
          >
            <input id="image-file" type="file" accept="image/*" hidden />
            <picture
              className="background-image"
              style={{
                backgroundImage:
                  "url(" +
                  (settings.theme === "dark"
                    ? backgroundBlack
                    : backgroundWhite) +
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
                <div
                  className="options-menu"
                  onClick={() => {
                    document.querySelector("#menu").classList.toggle("hidden");
                  }}
                >
                  <svg width="16" height="16">
                    <use xlinkHref={`${icons}#menu`} />
                  </svg>
                </div>
                <div id="menu" className="hidden">
                  <div className="menu-label">DEV Tests</div>
                  <div
                    className="menu-item"
                    onClick={() => {
                      document
                        .querySelector("#menu")
                        .classList.toggle("hidden");
                      this.setState({
                        ...this.state,
                        component: { name: "email" },
                      });
                    }}
                  >
                    Send a E-mail
                  </div>
                  <div
                    className="menu-item"
                    onClick={() => {
                      document
                        .querySelector("#menu")
                        .classList.toggle("hidden");
                      document.querySelector("#image-file").click();
                    }}
                  >
                    Upload and Store(Dropbox) a image
                  </div>
                  <div
                    className="menu-item"
                    onClick={() => {
                      document
                        .querySelector("#menu")
                        .classList.toggle("hidden");
                      logout();
                    }}
                  >
                    LogOut
                  </div>
                </div>
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
          <Loading theme={settings.theme} message={component.message} />
        )}
        {component && component.name === "email" && (
          <EmailSend
            theme={settings.theme}
            language={settings.language}
            onChildAction={this.onChildAction}
          />
        )}
        {dialog && (
          <Dialog
            theme={settings.theme}
            title={dialog.title}
            message={dialog.message}
            buttons={dialog.buttons}
            onClose={dialog.onClose}
          />
        )}
      </>
    );
  }
}

export default App;
