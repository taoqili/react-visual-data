import React from "react";
import { Designer } from '~engine/designer';
import appConfig from './app-config';
import panes from './panes'
import tools from './tools'
import actions from './actions'

// 应用数据初始化
const appInit = async (setScheme) => {
  const { fetchSchema } = appConfig;
  const res = await fetchSchema();
  if (res && res.code === 0 && res.data) {
    setScheme(res.data)
  } else {
    console.log('Schema 获取失败!')
  }
}

export default () => {
  return (
    <Designer
      appConfig={appConfig}
      panes={panes}
      actions={actions}
      tools={tools}
      onAppInit={appInit}
    />
  )
}
