import React from "react";
import { MinusCircleOutlined, ClearOutlined, PlusCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

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
    name: 'dialog',
    title: '弹窗',
    icon: <ExclamationCircleOutlined />,
    place: 'left',
    popupProps: {
      onOk: ({ view, setView, state, setState }) => {
        alert(1)
      },
      footer: null,
      okText: 'OK'
    },
    component: ({ view, setView, state, setState }) => {
      return (
        <div>123123123123123</div>
      )
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
    name: 'plus',
    title: '放大',
    icon: <PlusCircleOutlined />,
    place: 'right',
    onClick:({view, setView}) => {
      setView({ scale: Math.min(2, +view.scale + 0.1).toFixed(2) })
    }
  }
]
