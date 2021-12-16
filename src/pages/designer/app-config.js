import fetch from "~utils/http";

export default {
  // 站点名称
  siteName: 'DataV Pro - 数据大屏',
  // 站点logo
  siteLogo: 'http://cn.redux.js.org/img/redux.svg',
  // 获取初始schema
  fetchSchema: (data) => {
    return fetch({
      url: "/datav/screen",
      method: "post",
      data
    });
  },
  saveSchema: {
    url: '/datav/screen/save',
    method: 'post'
  }
}
