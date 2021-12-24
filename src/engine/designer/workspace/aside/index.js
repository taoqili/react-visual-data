import React from "react";
import Dock from '../../components/Dock'
import docks from './docks'
import "./index.less";

export default () => {
  return (
    <aside className={"lcp-design-aside"}>
      <Dock docks={docks} />
    </aside>
  );
};
