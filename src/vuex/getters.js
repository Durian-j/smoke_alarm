const getters = {

  userinfo: state => state.user.userinfo,
  token: state => state.user.token,
  // role: state => state.user.role,
  menus: state => state.user.menus,
  permissions: state => state.user.permissions,

  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
