import React from 'react'
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Modal } from "antd";
import { useView, useStore } from "../../../hooks";

export default (props = {}) => {
  const {
    title,
    clsPrefix,
    horizontal,
    visible,
    setVisible,
    popupProps = {},
    Component,
  } = props
  const { state, setState } = useStore()
  const { view, setView } = useView();
  const {onOk, onCancel } = popupProps;
  const handleOk = () => {
    setVisible(false)
    onOk && onOk({state, setState, view, setView})
  }
  const handleCancel = () => {
    setVisible(false)
    onCancel && onCancel({state, setState, view, setView})
  }
  if (horizontal) {
    return (
      <Modal
        title={title}
        visible={visible}
        {...popupProps}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Component {...{ state, setState, view, setView }} />
      </Modal>
    )
  }
  return (
    <Drawer
      title={
        <div className={`${clsPrefix}-pane-title`}>
          <div>{title}</div>
          <div onClick={() => setVisible(false)}><CloseOutlined /></div>
        </div>
      }
      placement={!horizontal ? 'left' : 'bottom'}
      closable={false}
      mask={false}
      visible={visible}
      getContainer={() => document.querySelector('.gc-design__wrapper')}
      style={{
        position: 'absolute',
        width: horizontal ? '100%' : 250
      }}
      {...popupProps}
    >
      <Component {...{view, setView, state, setState}} />
    </Drawer>
  )
}
