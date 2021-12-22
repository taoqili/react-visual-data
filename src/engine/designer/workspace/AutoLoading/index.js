import React from "react";
import { Spin } from "antd";
import "./index.less";

export default (props) => {
  return (
    <div className="lcp-design-loading-container">
      <Spin size="large" {...props} />
    </div>
  );
}
