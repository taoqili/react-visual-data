import React from "react";
import { connect } from "react-redux";
import Dock from '../Dock'
import docks from './docks'
import "./index.less";

const AsidePanel = ({ selected, dispatch }) => {
  return (
    <aside className={"lcp-design-aside"}>
      <Dock
        docks={docks}
        selected={selected}
        dispatch={dispatch}
      />
    </aside>
  );
};

export default connect((state) => ({
  selected: state.component.selected
}))(AsidePanel);
