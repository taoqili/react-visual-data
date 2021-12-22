import React from "react";
import { Button } from 'antd';
import storage from "../../../helper/storage";
import { MinusCircleOutlined, ClearOutlined, PlusCircleOutlined } from "@ant-design/icons";

export default [
  {
    name: 'clear',
    title: '清空参考线',
    icon: <ClearOutlined />,
    place: 'left',
    onClick: ({setView}) => {
      setView({
        isShowReferLine: false,
        lines: {
          h: [],
          v: []
        }
      })
    }
  },
  {
    name: 'minus',
    title: '缩小',
    icon: <MinusCircleOutlined />,
    place: 'right',
    onClick:({view, setView}) => {
      setView({ scale: Math.max(0.2, +view.scale - 0.1).toFixed(2) })
    }
  },
  {
    name: '100%',
    title: '100%',
    icon: <span>100%</span>,
    place: 'right',
    onClick:({setView}) => {
      setView({ scale: 1 })
    }
  },
  {
    name: 'save',
    title: '保存',
    icon: <Button>保存</Button>,
    place: 'right',
    onClick: ({state, setState}) => {
      // TODO fetchSave
      console.log('保存成功')
    }
  },
  {
    name: 'preview',
    title: '预览',
    icon: <Button>预览</Button>,
    place: 'right',
    onClick: ({ state }) => {
       storage.setLocal("schema_screen_config", {
          page: state.page,
          components: state.components
       });
       window.open('/preview/' + Date.now())
    }
  }
]
