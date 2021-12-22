import React from "react";
import { Empty } from "antd";
import { toRawType } from "../../utils/helper";

export const fieldGenerator = ({ fieldCanRedefine: can, Field: SourceField = null, props = {} }) => {
  return (args) => {
    const { Field: RedefineField = null, ...rest } = args;
    const Field = (can && RedefineField) || SourceField;
    if (Field) {
      return <Field {...props} {...rest} />;
    }
    return (
      <div className="gc-design__empty">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="组件未配置" />
      </div>
    );
  };
};

// 转化样式布局值
export function convertLayout(value, defaultValue = "100%") {
  // 是否为数字 ex："222"、222
  function isLooselyNumber(num) {
    if (toRawType(num) === "Number") return true;
    if (toRawType(num) === "String") {
      return !Number.isNaN(Number(num));
    }
    return false;
  }

  function isCssLength(str) {
    if (typeof str !== "string") return false;
    return str.match(/^([0-9])*(%|px|rem|em)$/i);
  }

  return isLooselyNumber(value) ? Number(value) : isCssLength(value) ? value : defaultValue;
}
