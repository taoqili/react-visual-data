import React, { useState } from "react";
import { Select } from 'antd';
import designerList from "./designer-market.json";
import FieldEnum from "./FieldEnum";
import './index.less';

const clsPrefix = 'lcp-design-pane';

export default () => {
  const [cname, setCname] = useState("");
  const designerTotal = Object.values(designerList).flat(1);

  const onChange = (value) => {
    setCname(value);
  };
  return (
    <div className={`${clsPrefix}-material`}>
      <Select
        style={{width: '100%', marginBottom: 10}}
        showSearch={true}
        allowClear={true}
        placeholder="查找对应组件"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {designerTotal.map((item) => {
          return (
            <Select.Option value={item.name} key={item.name}>
              {item.name}
            </Select.Option>
          );
        })}
      </Select>
      <FieldEnum value={cname} />
    </div>
  )
}
