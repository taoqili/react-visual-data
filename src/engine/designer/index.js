import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Ctx, StoreCtx } from "~hooks/useDesigner";
import { useDocumentTitle } from "~hooks/useDocumentTitle";
import { useSet } from "~hooks/useSet";
import { Designer } from "./core";
import { mergeFieldConfig, setLevelPath } from "./core/utils";
import DesignerAside from "./workspace/aside";
import DesignerHeader from "./workspace/header";
import DesignerBody from "./workspace/body";
import DesignerSetting from "./workspace/setting";
import { pathToParam, loadScript } from "~utils";
import { dataVApiList } from "@/api";


function App(props) {
  const { appConfig, onAppInit } = props;
  useDocumentTitle(appConfig.siteName);
  const [state, setState] = useSet({
    // 设置器tabKey
    settingTabsKey: "base",
    // 编辑区所有组件列表
    components: [],
    // 外部导入的app配置
    appConfig: {},
    // 页面属性
    page: {
      name: "",
      remark: "",
      pageSize: "large",
      zoom: "scaleX",
      backgroundMode: "define",
      backgroundColor: "rgba(29, 33, 39, 1)",
      backgroundImage: "",
      backgroundDefine: "background-2.png",
      backgroundBlur: 0,
      backgroundOpacity: 10,
      width: 1920,
      height: 1080
    },
    // 撤销列表
    undo: [],
    // 重复列表
    redo: []
  });

  const [view, setView] = useSet({
    // 右侧设置面板显隐控制
    rightPaneCollapsed: false,
    // 调试面板显隐控制
    visible: false,
    //
    rulerWidth: 0,
    rulerHeight: 0,
    width: 1366,
    height: 768,
    scale: 1,
    startX: 0,
    startY: 0,
    // 参考线
    lines: {
      h: [],
      v: []
    },
    isShowReferLine: true
  });

  useEffect(() => {
    // 初始化数据
    props.dispatch({ type: "component/mode", data: "development" });
    props.dispatch({ type: "component/querys", data: pathToParam() });
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css", "css");
    const storageData = async () => {
      try {
        const results = await Promise.all([dataVApiList()]).then((res) => {
          return res;
        });
        props.dispatch({ type: "component/api", data: results[0].data.data });
      } catch (err) {
        console.warn(err);
      }
    };
    storageData()
    onAppInit({
      setSchema: (schema = {}) => {
        const {
          page = state.page,
          components = []
        } = schema;
        setState({ page, components });
        props.dispatch({ type: "component/selected", data: "-" });
      },
      mixAppConfig: (appConfig) => {
        setState({appConfig})
      }
    })
  }, []);

  const onValueChange = (uniqueId, value, level = 0) => {
    setLevelPath(state.components, null);
    let results = mergeFieldConfig(state.components, { parentId: uniqueId, level: level }, value);
    setState({ components: results });
  };

  return (
    <Ctx.Provider value={{ state, setState }}>
      <StoreCtx.Provider value={{ view, setView }}>
        <DesignerHeader />
        <section className="gc-design__bd" id="designer">
          <DesignerAside />
          <DesignerBody {...state.page}>
            {
              state.components.length > 0
                ? state.components.map((prop, index) => (
                  <Designer index={index} value={prop} key={prop.uniqueId} onValueChange={onValueChange} />
                )) : null
            }
          </DesignerBody>
          <DesignerSetting />
        </section>
      </StoreCtx.Provider>
    </Ctx.Provider>
  );
}

export default connect((state) => state.component)(App);
