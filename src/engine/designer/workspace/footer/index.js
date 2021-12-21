import React from 'react';
import { Button, Space, Tooltip } from "antd";
import { useView } from "../../../hooks/useDesigner";
import { IconFont } from "~components";
import { round } from "~utils/helper";

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
    <div className="ruler-tool">
      <Tooltip title="清空所有参考线">
        <Button
          shape="circle"
          size="small"
          icon={<IconFont antd={true} type="SettingOutlined" />}
          onClick={handleSetting}
        />
      </Tooltip>
      <Space>
        <Tooltip title="缩小">
          <Button
            shape="circle"
            size="small"
            icon={<IconFont antd={true} type="ZoomOutOutlined" />}
            onClick={() => {
              setView({ scale: round(Math.max(0.2, scale - 0.1), 2) });
            }}
          />
        </Tooltip>
        <Tooltip title="放大">
          <Button
            shape="circle"
            size="small"
            icon={<IconFont antd={true} type="ZoomInOutlined" />}
            onClick={() => {
              setView({ scale: round(Math.min(2, scale + 0.1), 2) });
            }}
          />
        </Tooltip>
      </Space>
    </div>
  )
}
