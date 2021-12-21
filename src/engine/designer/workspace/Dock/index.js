import React, { useState } from "react";
import { Drawer, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './index.less';

const classPrefix = 'lcp-design-dock'
export default (props = {}) => {
  const {
    onChange,
    defaultActive,
    docks = []
  } = props;
  const [visible, setVisible] = useState(defaultActive)
  const [selectedName, setSelectedName] = useState({lasted: '', current: defaultActive})
  const selectedDocks = docks.filter(item => item.name === selectedName.current);
  const { component: Component, title } = selectedDocks.length ? selectedDocks[0] : {};
  const handleClick = (name) => {
    const lasted = selectedName.current
    const current = name
    setSelectedName({ lasted, current })
    if (lasted === current) {
      setVisible(!visible)
    } else {
      setVisible(true)
      setTimeout(() => {
        onChange && onChange(name)
      })
    }
  }
  return (
    <div className={`${classPrefix}-wrapper`}>
      {
        docks.map(item => {
          const { name, title, icon, onClick, component } = item || {};
          return (
            <div
              key={name}
              className={`${
                classPrefix}-icon ${name === selectedName.current && visible ? 'selected' : ''}`
              }
              onClick={() => {
                if (component) {
                  handleClick(name)
                } else if ( onClick ) {
                  onClick()
                }
              }}
            >
              <Tooltip placement="right" title={title}>
                {icon}
              </Tooltip>
            </div>
          )
        })
      }
      {
        Component && visible
          ? <Drawer
            title={
              <div className={`${classPrefix}-pane-title`}>
                <div>{title}</div>
                <div onClick={() => setVisible(false)}><CloseOutlined /></div>
              </div>
            }
            placement="left"
            closable={false}
            mask={false}
            visible={visible}
            getContainer={() => document.querySelector('.gc-design__wrapper')}
            style={{
              position: 'absolute',
              width: 250
            }}
          >
            <Component />
          </Drawer>: null
      }
    </div>
  )
}

