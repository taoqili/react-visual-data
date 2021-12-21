import React from 'react';
import { Tooltip } from "antd";
import { useView, useStore } from "../../../hooks";

export default (props = {}) => {
  const {
    docks = [],
    handleClick = () => {},
    clsPrefix,
    selectedName,
    visible
  } = props;
  const { view, setView } = useView();
  const {state, setState } = useStore();

  return docks.map(item => {
    const { name, title, icon, onClick, component, place } = item || {};
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
        <Tooltip placement={place in {left: 1, right: 1, center:1} ? 'top' : 'right'} title={title}>
          {icon}
        </Tooltip>
      </div>
    )
  })
}
