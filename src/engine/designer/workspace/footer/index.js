import React from 'react';
import Dock from '../../components/Dock'
import docks from './docks'
import './index.less'

export default () => {
  return (
    <div className={"lcp-design-footer"}>
      <Dock docks={docks} horizontal />
    </div>
  )
}
