import React, { Component } from "react";
import "./ImageViewer.css";
import icons from "../assets/icons.svg";

export default class ImageViewer extends Component {
  timer;

  showThenHideControls = () => {
    clearTimeout(this.timer);
    const header = document.querySelector("#viewer .viewer-header");
    const close = document.querySelector(
      "#viewer .viewer-header .viewer-window .ctrl"
    );
    header.classList.add("visible");
    close.classList.add("visible");
    const controls = document.querySelector("#viewer .viewer-controls");
    controls.classList.add("visible");
    this.timer = setTimeout(() => {
      const header = document.querySelector("#viewer .viewer-header");
      const close = document.querySelector(
        "#viewer .viewer-header .viewer-window .ctrl"
      );
      if (header) header.classList.remove("visible");
      if (close) close.classList.remove("visible");
      const controls = document.querySelector("#viewer .viewer-controls");
      if (controls) controls.classList.remove("visible");
    }, 3000);
  };

  componentDidMount() {
    this.play(this.props.index);
    this.showThenHideControls();
  }

  play = (index) => {
    this.showThenHideControls();
    const { images } = this.props;
    const loading = document.querySelector("#viewer-loading");
    const imageContainer = document.querySelector("#viewer-image");
    const image = document.querySelector("#viewer-image img");

    loading.classList.remove("hidden");
    imageContainer.classList.add("hidden");

    const img = new Image();
    img.onload = function () {
      image.src = this.src;
      loading.classList.add("hidden");
      imageContainer.classList.remove("hidden");
    };
    img.src = images[index].url;
  };

  render() {
    const { images, onChildAction } = this.props;
    return (
      <div id="viewer">
        <div id="viewer-loading" className="hidden">
          <div>CARREGANDO</div>
        </div>
        <div
          id="viewer-image"
          className="hidden"
          onClick={() => this.showThenHideControls()}
        >
          <img src="#" alt="" />
        </div>
        <div className="viewer-header">
          <div className="viewer-window">
            <div
              className="ctrl"
              onClick={() => onChildAction({ component: null })}
            >
              <svg width="16" height="16">
                <use xlinkHref={`${icons}#close`} />
              </svg>
            </div>
          </div>
        </div>
        {images.length > 1 && (
          <div className="viewer-controls visible">
            {images.map((image, idx) => (
              <div
                key={idx}
                className={`viewer-item${idx === this.index ? " active" : ""}`}
                style={{
                  backgroundImage: `url("${image.url}")`,
                  marginLeft: idx === 0 ? "0px" : "1px",
                }}
                onClick={() => this.play(idx)}
              ></div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
