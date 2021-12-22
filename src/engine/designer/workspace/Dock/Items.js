import React from "react";
import { Tooltip } from "antd";
import { useView, useStore } from "../../../hooks";
export default (props = {}) => {
  const {
    docks = [],
    clsPrefix,
    selectedName,
    visible,
    handleClick = () => {}
  } = props;
  const { view, setView } = useView();
  const {state, setState } = useStore();
  return docks.map(item => {
    const { name, title, icon:Icon, onClick, component, place } = item || {};
    const realIcon = typeof Icon === "function" ? Icon({state, setState, view, setView}) : Icon
    return (
      <div
        key={name}
        className={`${clsPrefix}-icon ${name === selectedName.current && visible ? 'selected' : ''}`}
        onClick={() => {
          if (component) {
            handleClick(name)
          } else if ( onClick ) {
            onClick({ view, setView, state, setState })
          }
        }}
      >
        <Tooltip
          title={title}
          placement={place in { left: 1, right: 1, center: 1 } ? 'top' : 'right'}
        >
          {realIcon}
        </Tooltip>
      </div>
    )
  })
}
