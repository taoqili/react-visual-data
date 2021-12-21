import React from "react";
import { AlignRightOutlined, AppstoreOutlined, DatabaseOutlined } from "@ant-design/icons";
import OutlinePane from '../../panes/OutlinePane'
import MaterialPane from '../../panes/MaterialPane'

export default [
  {
    name: 'outline',
    title: '大纲树',
    icon: <AlignRightOutlined />,
    component: OutlinePane
  },
  {
    name: 'material',
    title: '组件库',
    icon: <AppstoreOutlined />,
    component: MaterialPane
  },
  {
    name: 'dataSource',
    title: '数据源',
    icon: <DatabaseOutlined />,
    component: (props) => {
      return (
        <div>数据源</div>
      )
    }
  }
]
