
// 路由配置表
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import Login from '@/components/login/login'
import Home from '@/components/Home'
import Site from '@/components/site/site'
import Device from '@/components/device/device'
import Census from '@/components/census/census'
import Map from '@/components/map/map'
import Add from '@/components/user/add'
import Role from '@/components/user/role'
import Permission from '@/components/user/permission'
import store from '@/vuex/index'


//所有权限通用路由表
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  { path: '/', redirect: '/login', hidden: true },
  { path: '/login', component: Login, hidden: true },
  { path: '/main', component: Home, hidden: true }
]

//实例化 vue 的时候只挂载 constantRouter
export default new Router({
  routes: constantRouterMap
});


export const asyncRouterMap = [
  {
    path: '/main',
    component: Home,
    children:[
      {
        path: '/main/map',
        menu: 'map',
        component: Map,
        meta: {
         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/main/site',
        component: Site,
        title: '站点管理',
        menu: 'site',
        meta: {
         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/main/device',
        component: Device,
        title: '设备管理',
        menu: 'device',
        meta: {
         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/main/census',
        component: Census,
        title: '统计查询',
        menu: 'census',
        meta: {
         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/main/add',
        component: Add,
        title: '用户信息',
        menu: 'info',
        meta: {
         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/main/role',
        component: Role,
        title: '角色管理',
        menu: 'role',
        meta: {
         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: '/main/permission',
        component: Permission,
        title: '权限设置',
        menu: 'permission',
        meta: {
         requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
      },
    ]
  },

];


// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit("LOGIN", window.localStorage.getItem('token'))
}
