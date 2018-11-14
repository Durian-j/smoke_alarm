// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/index'
import Qs from 'qs'
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'



// 修改原型使axios可以在其他组件使用
 Vue.prototype.$axios= axios



Vue.use(ElementUI)
Vue.use(Vuex)

Vue.config.productionTip = false


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// http request 拦截器
axios.interceptors.request.use(
    config => {

        if (store.getters.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token

            config.headers.common['authorization'] = store.getters.token;
        }

        return config;

    },
    err => {
        return Promise.reject(err);
    });



// http response 拦截器
 axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    store.commit("LOGOUT");
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
                    alert('登录超时,请重新登录');
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    });


// 导航守卫判断用户的操作
router.beforeEach((to, from, next) => {

    if (to.path === '/login') {
        next();
    } else if (!store.getters.role) {


        const userPermission = store.getters.userinfo;

        store.dispatch('GenerateRoutes', userPermission).then(() => {

            //生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
            router.addRoutes(store.getters.addRouters);

            // 防止页面刷新取不到按钮的列表，所以重新赋值
            store.commit('SET_USER', userPermission.permissionList);

        }).catch(err => {
            console.log(err);
        });
        next(); // hack 方法 确保 addRoutes 已完成

    } else {
        next()
    }

})




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
