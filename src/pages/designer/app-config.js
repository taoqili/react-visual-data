import fetch from "~utils/http";

export default {
  // 站点名称
  siteName: 'Data - 数据大屏',
  // 站点logo
  siteLogo: '/static/logo.gif',
  // 获取初始schema
  fetchSchema: (data) => {
    return fetch({
      url: "/datav/screen",
      method: "post",
      data
    });
  },
  // 保存schema
  saveSchema: {
    url: '/datav/screen/save',
    method: 'post'
  }
}
