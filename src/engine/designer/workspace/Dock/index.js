import React, { useState } from "react";
import Items from './Items'
import useDocks from './useDocks'
import Pane from './Pane';
import './index.less';
import { useView, useStore } from "../../../hooks";

const clsPrefix = 'lcp-design-dock'
export default (props = {}) => {
  const {
    onChange,
    defaultActive,
    horizontal,
    docks = []
  } = props;
  const { view, setView } = useView()
  const { state, setState } = useStore()
  const [visible, setVisible] = useState(defaultActive)
  const [selectedName, setSelectedName] = useState({lasted: '', current: defaultActive})
  const selectedDocks = docks.filter(item => item.name === selectedName.current);
  const { component: Component, title, popupProps = {} } = selectedDocks.length ? selectedDocks[0] : {};
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
          ? <Pane {...{
              clsPrefix,
              title,
              horizontal,
              visible,
              setVisible,
              Component,
              popupProps: typeof popupProps === 'function' ? popupProps({view, setView, state, setState}) : popupProps
            }} />
          : null
      }
    </div>
  )
}

