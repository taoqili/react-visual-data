import React from 'react';
import { Button, Space, Tooltip } from "antd";
import { useView } from "../../../hooks/useDesigner";
import { IconFont } from "~components";
import { round } from "~utils/helper";
import Dock from '../Dock'
import docks from './docks'
import './index.less'

export default () => {
  const { view, setView } = useView();
  const { scale } = view;

  const handleSetting = () => {
    setView({
      isShowReferLine: false,
      lines: {
        h: [],
        v: []
      }
    });
  };

  return (
    <div className={"lcp-design-footer"}>
      <Dock docks={docks} horizontal />
    </div>
  )
}
