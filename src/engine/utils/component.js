import { Empty } from "antd";
import React from "react";
import { materials } from "~packages";

/**
 * 根据组件名获取物料库中对应的渲染组件
 * @param componentName
 * @returns {{componentCanRedefine: boolean, Component: (*|null)}}
 */
export const getCompGeneratorProps = (componentName) => {
  let componentCanRedefine = false;
  const Component = materials[componentName]
  if (Component) {
    componentCanRedefine = !!Component;
  }
  return {
    componentCanRedefine,
    Component: Component || null
  };
}

/**
 * 组件生成器
 * @param can
 * @param Component
 * @param props
 * @returns {function(*): *}
 */
export const componentGenerator = ({ componentCanRedefine: can, Component = null, props = {} }) => {
  return (args) => {
    const { Component: RedefineComponent = null, ...rest } = args;
    const Comp = (can && RedefineComponent) || Component;
    if (Comp) {
      return <Comp {...props} {...rest} />;
    }
    return (
      <div className="gc-design__empty">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="组件未配置" />
      </div>
    );
  };
};
