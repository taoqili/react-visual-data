import React, { useState } from "react";
import { Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Items from './Items'
import useDocks from './useDocks'
import './index.less';

const clsPrefix = 'lcp-design-dock'
export default (props = {}) => {
  const {
    onChange,
    defaultActive,
    horizontal,
    docks = []
  } = props;
  const [visible, setVisible] = useState(defaultActive)
  const [selectedName, setSelectedName] = useState({lasted: '', current: defaultActive})
  const selectedDocks = docks.filter(item => item.name === selectedName.current);
  const { component: Component, title } = selectedDocks.length ? selectedDocks[0] : {};
  const { leftDocks, centerDocks, rightDocks } = useDocks(docks, horizontal);

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
    <div className={`${clsPrefix}-wrapper ${horizontal ? 'horizontal' : ''}`}>
      {
        !horizontal
          ? <Items
              docks={docks}
              handleClick={handleClick}
              clsPrefix={clsPrefix}
              selectedName={selectedName}
              visible={visible}
            />
          : <>
              <div className={`${clsPrefix}-group`}>
                <Items
                  docks={leftDocks}
                  handleClick={handleClick}
                  clsPrefix={clsPrefix}
                  selectedName={selectedName}
                  visible={visible}
                />
              </div>
              <div className={`${clsPrefix}-group`}>
                <Items
                  docks={centerDocks}
                  handleClick={handleClick}
                  clsPrefix={clsPrefix}
                  selectedName={selectedName}
                  visible={visible}
                />
              </div>
              <div className={`${clsPrefix}-group`}>
                <Items
                  docks={rightDocks}
                  handleClick={handleClick}
                  clsPrefix={clsPrefix}
                  selectedName={selectedName}
                  visible={visible}
                />
              </div>
            </>
      }
      {
        Component && visible
          ? <Drawer
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
          >
            <Component />
          </Drawer>: null
      }
    </div>
  )
}

