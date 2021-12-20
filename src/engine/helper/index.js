import React from "react";
import { Empty } from "antd";

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
