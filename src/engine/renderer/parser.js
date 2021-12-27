import React, { useState, useEffect } from "react";
import classnames from "classnames";
// import { fieldGenerator } from "../utils/field";
// import { getField } from "~packages";
import { compRenderGenerator, getCompGeneratorProps } from "../utils/component";

const Parser = ({ value }) => {
  const [show, setShow] = useState(true);
  const { width, height, background, left, top, isHidden, ...rest } = value.data || {};
  const className = classnames("animate__animated", {
    [`animate__${rest.animateType}`]: rest.animateType,
    [`animate__${rest.animateSpeed}`]: rest.animateSpeed,
    [`animate__${rest.animateRepeat}`]: rest.animateRepeat,
    [`animate__delay-${rest.animateTime}s`]: rest.animateTime
  });

  const overwriteStyle = {
    position: "absolute",
    left: left,
    top: top,
    padding: "5px 12px",
    width: width,
    height: height,
    borderColor: "transparent",
    borderWidth: 2,
    borderStyle: "solid",
    background,
    boxShadow: rest.shadowColor
      ? `${rest.shadowColor} ${rest.shadowWidth || 0} ${rest.shadowOffset || 0} ${rest.shadowOffset || 0}`
      : rest.shadowWidth
  };

  useEffect(() => {
    setShow(!isHidden);
  }, [isHidden]);

  const createComponent = (compProps) => {
    const generatorProps = getCompGeneratorProps(value.type);
    const generator = compRenderGenerator(generatorProps);
    return generator(compProps);
  };

  return (
    <div style={overwriteStyle} className={className}>
      {
        show
          ? createComponent({
            isDevelop: false,
            type: value.type,
            value: value.data,
            uniqueId: value.uniqueId,
            options: value.data.config
          }) : null
      }
    </div>
  );
};

export default ({ components = [] }) => {
  return components.map((item) => <Parser value={item} key={item.uniqueId} />);
};
