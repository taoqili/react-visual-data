import React, { useEffect, useState } from "react";
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
    popupProps: {
      footer: <span>自定义底部</span>
    },
    component: ({view, setView, state, setState}) => {
      const [name, setName] = useState('Test')
      useEffect(() => {
        setName('Change')
      }, [])
      return (
        <div>数据源 {name}</div>
      )
    }
  }
]
