/**
 * 基于rnd的核心拖拽方案
 */
import React, { useMemo, useState, useEffect, useCallback } from "react";
import classnames from "classnames";
import { Rnd } from "react-rnd";
import { useStore, useView } from "../../hooks/useDesigner";
import { compRenderGenerator, getCompGeneratorProps } from "../../utils/component";
import { round, convertLayout, throttle } from "../../utils";

function AlignLine() {
  return (
    <div className="widget-circle">
      <div className="widget-circle__top">
        <div className="top-left"></div>
        <div className="top-center"></div>
        <div className="top-right"></div>
      </div>
      <div className="widget-circle__bottom">
        <div className="bottom-left"></div>
        <div className="bottom-center"></div>
        <div className="bottom-right"></div>
      </div>
      <div className="widget-circle__left">
        <div className="left-center"></div>
      </div>
      <div className="widget-circle__right">
        <div className="right-center"></div>
      </div>
    </div>
  );
}

// TODO：ui和组件拔插模式
function DraggableComponent({ value, tabBind, tabStore, onValueChange }) {
  const { width, height, background, left, top, isHidden, isLock, ...rest } = value.data;
  const [ locations, setLocations] = useState({ left: left, top: top });
  const [ show, setShow] = useState(true);
  const { state, setState } = useStore();
  const { view } = useView();

  const classNames = classnames("drag-shape-wrap animate__animated", {
    [`animate__${rest.animateType}`]: rest.animateType,
    [`animate__${rest.animateSpeed}`]: rest.animateSpeed,
    [`animate__${rest.animateRepeat}`]: rest.animateRepeat,
    [`animate__delay-${rest.animateTime}s`]: rest.animateTime,
    "is-hidden": !show
  });

  const hasSelected = useMemo(() => {
    return state.currentNode === value.uniqueId;
  }, [state.currentNode]);

  const hasEditing = useMemo(() => {
    return !hasSelected || isLock || isHidden;
  }, [hasSelected, isLock, isHidden]);

  // TODO: tabs控件控制器
  // useEffect(() => {
  //   if (tabStore.length === 0) return;
  //
  //   let canTabStore = tabStore.reduce((arr, item) => {
  //     if (item.pid === tabBind[0].pid) {
  //       item.tabBindChart.forEach((m) => {
  //         if (m.bindChart.length > 0) {
  //           arr.push(...m.bindChart);
  //         }
  //       });
  //     }
  //
  //     return arr;
  //   }, []);
  //
  //   // 汇总关联组件去重
  //   canTabStore = Array.from(new Set(canTabStore)).find((item) => item === value.uniqueId);
  //
  //   if (canTabStore && value.type !== "tabs") {
  //     const ret = tabStoreIds.some((el) => el.bindChart.includes(value.uniqueId));
  //
  //     setShow(ret);
  //   }
  // }, [tabBind]);

  useEffect(() => {
    setShow(!isHidden);
  }, [isHidden]);

  useEffect(() => {
    setLocations({ left, top });
  }, [left, top]);

  const handleClick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (hasSelected) return;
    setState({ settingTabsKey: "base", currentNode: value.uniqueId });
  };

  // todo: 鼠标移上根据实际情况使用
  const onMouseOver = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (hasSelected) return;
    setState({currentNode: value.uniqueId});
  };

  const overwriteStyle = {
    width: convertLayout(width),
    height: convertLayout(height),
    borderStyle: rest.borderStyle || "solid",
    borderColor: hasSelected ? "#2681ff" : "transparent",
    background,
    borderRadius: rest.borderRadius,
    borderWidth: rest.borderWidth || 2,
    boxShadow: rest.shadowColor
      ? `${rest.shadowColor} ${rest.shadowWidth || 0} ${rest.shadowOffset || 0} ${rest.shadowOffset || 0}`
      : rest.shadowWidth
  };

  const renderComponent = useCallback((compProps) => {
    const generatorProps = getCompGeneratorProps(value.type);
    const generator = compRenderGenerator(generatorProps);
    return generator(compProps);
  }, [value.type]);

  const onDragHandle = (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO： 调优节流
    throttle(
      setLocations({
        left: parseInt(round(d.lastX)),
        top: parseInt(round(d.lastY))
      })
    );
  };

  const onDragStopHandle = (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange(
      value.uniqueId,
      Object.assign(value.data, {
        left: parseInt(round(d.lastX)),
        top: parseInt(round(d.lastY))
      })
    );
  };

  const onResizeHandle = (e, direction, ref, delta, position) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO： 调优节流
    throttle(
      onValueChange(
        value.uniqueId,
        Object.assign(value.data, {
          left: parseInt(round(position.x)),
          top: parseInt(round(position.y)),
          width: ref.offsetWidth,
          height: ref.offsetHeight
        })
      )
    );
  };

  // 阻止事件默认事件、冒泡
  const onStopPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return;
  };

  const propsValue = useMemo(() => ({
    value: value.data,
    uniqueId: value.uniqueId,
    type: value.type,
    options: value.data.config || {},
    onChange: (val, level = 1) => {
      onValueChange && onValueChange(value.uniqueId, val, level);
    }
  }), [onValueChange]);

  return (
    <Rnd
      className={classNames}
      style={overwriteStyle}
      size={{ width, height }}
      position={{ x: left, y: top }}
      id={value.uniqueId}
      bounds="body"
      dragAxis="both"
      disableDragging={hasEditing}
      enableResizing={!hasEditing}
      scale={view.scale}
      onDragStart={onStopPropagation}
      onDrag={onDragHandle}
      onDragStop={onDragStopHandle}
      onResize={onResizeHandle}
      onResizeStop={onStopPropagation}
      // onMouseOver={onMouseOver}
      onClick={handleClick}
    >
      <div className={classnames("grid-line", { "is-active": hasSelected })}>
        <div className="grid-line-top"></div>
        <div className="grid-line-left"></div>
        <div className="grid-line-label">
          {locations.left}, {locations.top}
        </div>
      </div>
      {hasSelected ? <AlignLine /> : null}
      {renderComponent(propsValue)}
    </Rnd>
  );
}

export default DraggableComponent;
