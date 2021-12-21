import React, { useEffect, useMemo } from "react";
import { AutonContainer, Scrollbar } from "~components";
import Renderer from "./parser";
import { useDocumentTitle } from "~hooks/useDocumentTitle";
import storage from "~utils/storage";
import { useDesigner } from "../../hooks/useDesigner";

function PanelPreview(props) {
  let schemaConfig = storage.getLocal("schema_screen_config") || {};
  const {
    backgroundMode,
    backgroundColor,
    backgroundImage,
    backgroundDefine,
    zoom,
    backgroundOpacity,
    backgroundBlur,
    width,
    height
  } = schemaConfig.page;
  const {state, setState } = useDesigner();

  useDocumentTitle(`DataV Pro - ${schemaConfig.page.name || "未命名"}`);

  useEffect(() => {
    setState({mode: 'preview'})
    return () => {
      storage.clear();
    };
  }, []);

  const backgroundStyles = useMemo(() => {
    if (backgroundMode === "custom") {
      return backgroundImage ? `url(${backgroundImage}) 0% 0% / 100% 100%` : backgroundColor;
    }

    if (backgroundMode === "define") {
      return `url(./static/template/${backgroundDefine}) 0% 0% / 100% 100%`;
    }

    return backgroundColor ? backgroundColor : null;
  }, [backgroundMode, backgroundImage, backgroundDefine, backgroundColor]);

  const containerStyles = {
    background: backgroundStyles,
    filter: `blur(${backgroundBlur}px)`,
    opacity: parseFloat(backgroundOpacity / 10)
  };

  return (
    <Scrollbar>
      <AutonContainer config={{ width, height }} zoom={zoom}>
        <div className="bg-container" style={containerStyles} />
        <Renderer widgets={schemaConfig.components} />
      </AutonContainer>
    </Scrollbar>
  );
}

export default PanelPreview;
