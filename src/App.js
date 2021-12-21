import React, { PureComponent } from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Router from "./router";

import "./styles/format.less";

class App extends PureComponent {
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Router />
      </ConfigProvider>
    );
  }
}

export default App;
