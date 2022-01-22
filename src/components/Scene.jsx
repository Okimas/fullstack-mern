import React from "react";
import "./Scene.css";
import parse from "html-react-parser";

const Scene = ({ scene, active, onChildAction }) => {
  return (
    <div className={`scene${active ? " active" : ""}`}>
      <div className="label">{scene.title}</div>
      <div>
        {scene.texts.map((text, index) => {
          const imageColumm = text.image && text.image.class.includes("columm");
          return (
            <div key={scene.number + "-text-" + index} className="text">
              {text.image && text.image.url && text.image.alt && (
                <img
                  className={`image${
                    text.image.class ? " " + text.image.class : ""
                  }`}
                  src={text.image.url}
                  alt={text.image.alt}
                />
              )}
              <div className={`${imageColumm ? "wrap" : ""}`}>
                {text.title && <div className="subtitle">{text.title}</div>}
                {parse(text.text)}
              </div>
            </div>
          );
        })}
      </div>
      {scene.images && scene.images.list && scene.images.list.length > 0 && (
        <>
          {scene.images.title && (
            <div className="subtitle">{scene.images.title}</div>
          )}
          <div className="images">
            {scene.images.list.map((image, index) => (
              <img
                key={scene.number + "-image-" + index}
                src={image.url}
                alt={image.alt}
                onClick={() =>
                  onChildAction({
                    component: {
                      name: "imageviewer",
                      images: scene.images.list,
                      index,
                    },
                  })
                }
              />
            ))}
          </div>
        </>
      )}
      {scene.links && scene.links.length > 0 && (
        <div className="links">
          {scene.links.map((link, index) => (
            <a
              key={scene.number + "-link-" + index}
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scene;
