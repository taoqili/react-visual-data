import React from 'react';
import { Designer } from '~engine/designer';

const designerConfig = {
  name: 'DataV Pro - 数据大屏',
}

export default () => {
  return (
    <Designer {...designerConfig} />
  )
}
