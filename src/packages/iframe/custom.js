import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { notification } from "antd";
import { onEvent, offEvent } from "~utils";
import "./style.less";
import { useDesigner } from "../../hooks/useDesigner";

const CustomIframe = ({ uniqueId, value, onChange, ...rest }) => {
  const {
    dataConfig: { count, data }
  } = value;
  const iframeRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [path, setPath] = useState(`./demo.html?t=${count}`);
  const { state, setState } = useDesigner();

  // TODO: 通知子iframe框架数据
  const onNotice = () => {
    iframeRef.current.contentWindow.postMessage(
      {
        data: dataSource,
        config: value
      },
      "*"
    );
  };

  // TODO：联动处理
  const handleDependence = (param) => {
    if (value.dependence.length === 0) return;
    setState({dependencies: state.dependencies.concat(param)})
  };

  const onMessage = (event) => {
    if (event.data.isDD && state.currentNode !== uniqueId) {
      setState({currentNode: uniqueId});
    }

    if (!event.data.path || event.data.path.indexOf(path) < 0) {
      if (value.dependenceOpen && value.dependence && value.dependence.length && event.data.isDD) {
        handleDependence(value.dependence);
      }
    }

    if (event.data.render) {
      onNotice();
    }

    if (event.data.error) {
      notification.error({
        message: `${event.data.error}`,
        description: value.name + "渲染错误",
        duration: 5
      });
    }
  };

  useEffect(() => {
    if (count) {
      setPath(`./demo.html?t=${count}`);
    }
    setDataSource(data);
  }, [data, count]);

  useEffect(() => {
    onEvent(window, "message", onMessage);
    if (value.openUseHttp && "https:" === location.protocol) {
      notification.error({
        message:
          "您目前使用HTTPS方式访问，但是存在使用http协议的资源，浏览器的安全策略不允许，您可以保存并退出编辑模式，并按照提示进入HTTP方式"
      });
    }

    return () => {
      offEvent(window, "message", onMessage);
    };
  }, [dataSource]);

  // TODO：刷新清空联动集合ids
  useEffect(() => {
    if (state.dependencies.includes(uniqueId)) {
      setDataSource(data);
      setState({dependencies: []})
      onNotice();
    }
  }, [state.dependencies]);

  return (
    <iframe
      className="gc-iframe__html"
      ref={(el) => {
        iframeRef.current = el;
      }}
      style={{ width: "100%", height: "100%" }}
      src={path}
      frameBorder="0"
      allowFullScreen={true}
    />
  );
};

export default CustomIframe;
