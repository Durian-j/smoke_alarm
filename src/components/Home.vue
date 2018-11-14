<template>
  <div class="smokebody">
    <div class="aside">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#26344b"
        text-color="#4398ff"
        active-text-color="#fff"
        router>
        <div class="logo">
        </div>
        <el-menu-item index="/main/map" v-if="hasRouter('map')">
          <i class="iconfont icon-tubiao115"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/main/site" v-if="hasRouter('site')">
          <i class="iconfont icon-qiu"></i>
          <span slot="title">站点管理</span>
        </el-menu-item>
        <el-menu-item index="/main/device" v-if="hasRouter('device')">
          <i class="iconfont icon-shezhi"></i>
          <span slot="title">设备管理</span>
        </el-menu-item>
        <el-submenu index="4">
          <template slot="title">
            <i class="iconfont icon-biaoshilei_xitong"></i>
            <span>系统管理</span>
          </template>
          <el-submenu index="4-4" v-if="hasRouter('info')||hasRouter('role')">
            <template slot="title">
              <div class="twomenu">
                <i class="iconfont icon-quanxianguanli"></i><span class="two">用户管理</span>
              </div>
            </template>
            <el-menu-item index="/main/add" v-if="hasRouter('info')"><span class="three">用户信息</span></el-menu-item>
            <el-menu-item index="/main/role" v-if="hasRouter('role')"><span class="three">角色管理</span></el-menu-item>
          </el-submenu>
          <el-submenu index="4-5" v-if="hasRouter('permission')">
            <template slot="title">
              <div class="twomenu">
                <i class="iconfont icon-quanxianguanli"></i><span class="two">权限管理</span>
              </div>
            </template>
            <el-menu-item index="/main/permission"><span class="three">权限设置</span></el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="/main/census" v-if="hasRouter('census')">
          <i class="iconfont icon-fptj"></i>
          <span slot="title">统计查询</span>
        </el-menu-item>
      </el-menu>
      <div class="backimg">
      </div>
    </div>

    <div class="smokeright">
      <div class="header">
        <div class="right">
          <div class="info">
            <el-popover
              ref="popover4"
              placement="bottom"
              trigger="click">
              <div class="message">
                <div class="messheader">
                  <h5><span></span>消息提醒</h5>
                </div>
                <div class="messbody">
                  <div class="" v-for="item in gridData">
                    <span>站点 :</span><p>{{item.site_name}}</p><br>
                    <span>建筑 :</span><p>{{item.building_name}}</p><br>
                    <span>楼层 :</span><p>{{item.floor_name}}</p><br>
                    <span>详细地址 :</span><p>{{item.address}}</p>
                  </div>
                </div>
              </div>
            </el-popover>
            <el-badge :value="this.alarmnum" class="item" v-popover:popover4>
              <i class="iconfont icon-icon--"></i><span>消息</span>
            </el-badge>
          </div>
          <div class="logout" @click="logout()">
            <i class="iconfont icon-tuichu"></i><span>退出</span>
          </div>
        </div>
      </div>
      <div class="smobody">
        <router-view/>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data(){
    return{
      alarmnum:0,
      gridData: [],
    }
  },
  created(){
    this.alarminfo()
  },
  methods: {
    logout(){
      this.$store.commit("LOGOUT")
      this.$router.push({ path: '/' });
      location.reload(true)
    },

    // 匹配路由
    hasRouter(permission){
      let myPermissions = this.$store.getters.addRouters[0];
      var permissionarr=[];
      for(let i=0;i<myPermissions.children.length;i++){
        permissionarr.push(myPermissions.children[i].menu)
      }
      return permissionarr.indexOf(permission) > -1;
    },

    // 获取详细报警消息
    alarminfo(){
      this.$axios.get(process.env.API_HOST+'api/v1/collectionAlarm')
      .then(res => {
          this.gridData=res.data.collectionInfoList;
          this.alarmnum=res.data.collectionInfoList.length
      })
      .catch(error => {
      });
    }

  },
  computed: {
        ...mapGetters([
          'permission_routers',
        ])
  }
}
</script>

<style lang="scss" scoped>
  .smokebody{
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .aside{
    width: 235px;
    height: 100%;
    float: left;
    background-color: #26344b;
    .logo{
      height: 114px;
      background: #1b2a43 url(../assets/image/logo1.png) no-repeat center center;
      border-bottom: 1px solid #465876;
    }
    .backimg{
      position: absolute;
      bottom: 0;
      height: 377px;
      width: 235px;
      opacity: 0.2;
      background: url(../assets/image/bgm.png) no-repeat left bottom;
    }
  }
  .smokeright{
    background-color: #edf0f5;
    margin-left: 235px;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .header{
    height: 50px;
    padding-top: 17px;
    background-color: #26344b;
    .right{
      width: 180px;
      float: right;
      margin-top: 5px;
      color: #3b8ff5;
      font-size: 16px;
      div{
        float: left;
        width: 74px;
        cursor: pointer;
      }
      .logout{
        padding-left: 15px;
        width: 69px;
        padding-top: 1px;
        i{
          font-size: 19px;
          vertical-align: top;
        }
      }
      i{
        font-size: 24px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
  .el-menu-item,.el-submenu__title{
    i{
      margin-right: 10px;
      color: #4398ff;
      font-size: 20px;
    }
  }
  .el-menu{
    border: 0;
    z-index: 50;
    .el-menu-item{
      border-bottom: 1px solid #465876;
    }
  }
  .item {
    margin-right: 40px;
  }
  .smobody{
    padding: 0 12px;
  }
  .message{
    width: 298px;
    max-height: 365px;
    overflow: auto;
	  background-color: #ffffff;
    .messheader{
      height: 30px;
      border-bottom: 1px solid #e4e4e4;
      h5{
        font-size: 14px;
        color: #4398ff;
        font-weight: normal;
        display: inline-block;
        padding-left: 8px;
        span{
          width: 3px;
        	height: 13px;
          display: inline-block;
          vertical-align: middle;
        	background-color: #4398ff;
          margin-right: 8px;
        }
      }
    }
    .messbody{
      >div{
        height: 133px;
        margin-top: 10px;
        font-size: 12px;
        border: 1px solid #eee;
        span{
          color: #999999;
          margin-left: 12px;
          margin-top: 12px;
          display: inline-block;
        }
        p{
          display: inline-block;
          color: #666666;
          margin-left: 3px;
        }
      }
      >div:hover{
        background-color: #f7f7f7;
      }
    }
  }
  .two{
    font-size: 14px;
  }
  .three{
    font-size: 14px;
  }
  .twomenu{
    background-color: green;
    width: 165px;
	  height: 40px;
    position: absolute;
	  background-color: #314361;
    left: 6px;
    top: 8px;
    padding-left: 54px;
    line-height: 40px;
  }



</style>
<style lang="scss">
  .el-table thead{
    color: inherit;
  }
  .el-menu-item,.el-submenu__title{
    font-size: 16px;
    letter-spacing: 1px;
    padding-left: 35px !important;
    border-bottom: 1px solid #465876;
    position: relative;
  }
  .el-menu--inline .el-submenu__title{
    padding-left: 60px !important;
  }
  .el-menu--inline{
    .el-menu-item{
      padding-left: 90px !important;
    }
  }
  .el-badge__content.is-fixed{
    right: 60px;
  }
  .el-badge__content{
    width: 16px;
    height: 16px!important;
    padding: 0px;
    border-radius: 50%;
  }
  .el-input__inner{
    border-color: #bbbaba;
  }
  .select{
    .el-input__inner{
      height: 34px;
      border: 1px solid #ccc;
    }
  }
  .el-table td, .el-table th.is-leaf{
    border-color: #ccc;
  }
  .el-table th.is-leaf{
    background-color: #f7f7f7;
  }
  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-color: #ccc;
  }
  .el-table--border, .el-table--group{
    border-color: #ccc;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    background-color: #ccc;
  }
  .el-table .descending .sort-caret.descending{
    border-top-color:#4ea5ef;
  }
  .el-table .ascending .sort-caret.ascending{
    border-bottom-color:#4ea5ef;
  }
  // .el-button--primary:focus, .el-button--primary:hover,.el-button--primary{
  //   background: #4ea5ef;
  //   border-color: #4ea5ef;
  // }
  // .el-button.is-plain:focus, .el-button.is-plain:hover{
  //   color: #4ea5ef;
  // }
  .detailtab .el-table{
    border: 1px solid #ccc;
  }
  .el-table::before{
    height: 0px;
  }
  .el-message-box__btns{
    .el-button--small:hover{
      color: #606266;
      background-color: #fff;
      border-color: #dcdfe6;
    }
    .el-button--primary:hover{
      color: #fff;
      background-color: #4ea5ef;
      border-color: #4ea5ef;
    }
  }
  .el-menu-item.is-active{
    background-color: #3b8ff5!important;
    i{
      color: #fff;
    }
  }
  .el-message-box__btns{
    .el-button{
      float: right;
      margin-right: 10px;
    }
  }

</style>
