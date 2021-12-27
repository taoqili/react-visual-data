import React, { useEffect, forwardRef, useRef, useMemo, useLayoutEffect, useCallback } from "react";
import { Scrollbar, SketchRuler } from "~components";
import { cloneDeep } from "../../../utils";
import { addComponent } from "../../core/utils";
import { useAutoResize } from "../../../hooks/useAutoResize";
import { useView, useStore } from "../../../hooks/useDesigner";
import { THICK, DIMENSION } from "../../constants";
import { componentMarket } from "../../configuration-value";
import Footer from '../footer'

/**
 * 设计器容器大小
 */
function Wrapper(props, ref) {
  let {
    pageSize,
    backgroundMode,
    backgroundColor,
    backgroundImage,
    backgroundDefine,
    backgroundBlur,
    backgroundOpacity
  } = props;
  const { state, setState } = useStore();
  const { view, setView } = useView();
  const { width, height, domRef } = useAutoResize(ref);
  const containerRef = useRef(null);

  const { rulerWidth, rulerHeight, scale, startX, startY, lines, isShowReferLine } = view;

  useEffect(() => {
    setView({
      rulerWidth: width ? width : 0,
      rulerHeight: height,
      scale: scaleSize
    });

    return () => {
      setView({
        isShowReferLine: false,
        lines: {
          h: [],
          v: []
        }
      });
    };
  }, [width, height]);

  useLayoutEffect(() => {
    if (pageSize === "custom") {
      // setView({
      //   width: props.customPageSize.width,
      //   height: props.customPageSize.height
      // });
    } else {
      setView({
        width: DIMENSION[pageSize].width,
        height: DIMENSION[pageSize].height
      });
    }
  }, [pageSize]);

  // 计算设计器画布缩放比例
  const scaleSize = useMemo(() => {
    return width ? Math.floor((width / view.width) * 100) / 100 : 1;
  }, [width, view.width]);

  const handleClick = () => {
    setState({currentNode: '-'})
    setView({rightPaneCollapsed: false});
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        const name = event.dataTransfer.getData("text");
        const findComponent = componentMarket.find((item) => item.type === name);
        if (findComponent) {
          let configs = cloneDeep(findComponent);
          configs.data.left = event.nativeEvent.offsetX - configs.data.width / 2;
          configs.data.top = event.nativeEvent.offsetY - configs.data.height / 2;

          const { components, fieldId } = addComponent(state.components, configs);
          setState({ settingTabsKey: "base", components: components, currentNode: fieldId });
        }
      } catch (error) {
        console.log(`组件创建失败，${error}`);
      }
    },
    [state.components]
  );

  const handleLine = (lines) => {
    setView({ lines });
  };
  // 显示/隐藏 参考线
  const handleShowReferLine = () => {
    setView({ isShowReferLine: !isShowReferLine });
  };

  const containerStyle = {
    width: view.width * scale + "px",
    height: view.height * scale + "px"
  };

  const canvasStyle = {
    width: view.width,
    height: view.height,
    transform: `scale(${scale})`
  };

  const backgroundStyles = useMemo(() => {
    if (backgroundMode === "custom") {
      return backgroundImage ? `url(${backgroundImage}) 0% 0% / 100% 100%` : backgroundColor;
    }

    if (backgroundMode === "define") {
      return `url(./static/template/${backgroundDefine}) 0% 0% / 100% 100%`;
    }

    return backgroundColor ? backgroundColor : null;
  }, [backgroundMode, backgroundImage, backgroundDefine, backgroundColor]);



  return (
    <div className="gc-design__wrapper">
      {/* 刻度尺 */}
      <SketchRuler
        THICK={THICK}
        scale={scale}
        width={rulerWidth}
        height={rulerHeight}
        startX={startX}
        startY={startY}
        horLineArr={lines.h}
        verLineArr={lines.v}
        isOpenMenuFeature={true}
        isShowReferLine={isShowReferLine}
        handleLine={handleLine}
        handleShowReferLine={handleShowReferLine}
      />
      <div className="ruler-wrapper" ref={domRef}>
        <Scrollbar
          ref={(el) => {
            containerRef.current = el;
          }}
        >
          <div className="canvas-container design-panel" style={containerStyle} tabIndex="-1">
            <div className="design-body" onClick={handleClick}>
              <div className="design-container" style={canvasStyle} onDragOver={handleDragOver} onDrop={handleDrop}>
                <div
                  className="bg-container"
                  style={{
                    background: backgroundStyles,
                    filter: `blur(${backgroundBlur}px)`,
                    opacity: parseFloat(backgroundOpacity / 10)
                  }}
                />
                {props.children}
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
      <Footer />
    </div>
  );
}

export default forwardRef(Wrapper);
