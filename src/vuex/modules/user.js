const user = {
  state: {
    userinfo: JSON.parse(localStorage.getItem('userinfo')),
    token: localStorage.getItem('token'),
    nickname: "",
    userId: "",
    // role: '',
    menus: [],
    permissions: [],
  },
  mutations: {
    // 登录
      LOGIN(state,data){
        localStorage.token = data;
        state.token = data;
      },
      // 退出
      LOGOUT(state){
        localStorage.removeItem('token');
        localStorage.removeItem('userinfo');
        state.token = null;
        state.userinfo = null;
      },
      // 保存用户信息
      SAVE(state,data){
        state.userinfo = data;
        localStorage.userinfo = JSON.stringify(data);
      },
      // 将路由和按钮分类
      SET_USER: (state, data) => {
        // state.role = userInfo.roleName;
        state.menus = data;
        state.permissions = data;
      },

  },
}
export default user
