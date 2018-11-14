<template>
  <div class="login">
    <el-main>
      <el-form
        :model="LoginForm"
        ref="LoginForm"
        :rules="rule"
        label-width="0"
        class="login-form">
        <div class="loginbg">
        </div>
        <div class="title">
          <img src="../../assets/image/line01.jpg" alt="" style="display:block">
          <img src="../../assets/image/logo.png" alt="" style="margin:48px 47px">
        </div>
        <div class="user">

          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="LoginForm.username"
              class="username"
              placeholder="请您输入用户名" >
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              @keyup.native.enter="submit"
              type="password"
              v-model="LoginForm.password"
              class="password"
              placeholder="请您输入密码">
            </el-input>
          </el-form-item>
          <el-form-item >
            <el-button
              class="submitBtn"
              @click.native.prevent="submit"
              :loading="logining">
              登 录
            </el-button>
          </el-form-item>
        </div>

      </el-form>
    </el-main>
  </div>
</template>

<script>
import Qs from 'qs'
import { Message } from 'element-ui';

export default {
  data () {
    return {
      LoginForm: {
        username: '',
        password: ''
      },
      logining: false,
      checked: false,
      btnpermission:[],
      rule: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          }
        ]
      }
    }
  },

  // 监听获得权限之后再进行跳转
  watch: {
    btnpermission(newValue, oldValue) {
        if(newValue!=oldValue){
          this.$router.push('/main/map')
        }
      }
  },

  methods: {
    submit () {
      this.$refs.LoginForm.validate(valid => {
        if (valid) {

            this.$axios.post('api/v1/login',
              Qs.stringify({
                'username':this.LoginForm.username,
                'password':this.LoginForm.password})
                )
            .then( res => {
              if(res.status === 200){

                this.$store.commit('LOGIN',res.data);

                this.$axios.get('api/v1/findPermissionList?'+Qs.stringify({'username':this.LoginForm.username})
                    )
                .then(res => {
                    this.$store.commit('SAVE',res.data);
                    this.$store.commit('SET_USER',res.data.permissionList);
                    this.btnpermission=this.$store.getters.permissions;
                })
                .catch(error => {
                  console.log(error);
                });

              }
            })
            .catch( error => {
              this.$message.error('用户名或密码不正确');
            });

        } else {
          this.$message.error('请输入用户名和密码');
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .login{
    width: 100%;
    height: 100%;
    background-image: url(../../assets/image/bg.jpg);
    background-size: cover;
  }
  .login-form {
    width: 1016px;
  	height: 429px;
  	box-shadow: 5px 5px 5px 0px	rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);
    background:#fff url(../../assets/image/triangle.png) no-repeat bottom right;
    >div{
      float: left;
    }
    .loginbg{
      background-image: url(../../assets/image/left_bg.jpg);
      width: 472px;
      height: 429px;
      background-size: cover;
    }
    .title{
      height: 100px;
    }
  }
  .user{
    padding: 35px 0px 0px 47px;


    .el-input{
      width: 451px;
    }
    p{
    	height: 16px;
    	font-size: 16px;
    	font-weight: normal;
    	font-stretch: normal;
    	line-height: 16px;
    	letter-spacing: 0px;
    	color: #41a1df;
      float: right;
    }
    .submitBtn{
      width: 451px;
    	height: 55px;
    	background-color: #4398ff;
      font-family: "MicrosoftYaHei";
    	font-size: 20px;
    	font-weight: normal;
    	color: #ffffff;
      margin-top: 20px;
      border-radius: 0px;
    }
  }
  .el-input__prefix{
    i{
      margin-left: 5px;
    }
  }

</style>

<style lang="scss">
  .user{
    .el-input__inner{
      border-radius: 0px;
      border: 0px;
      border-bottom: 1px solid #e4e4e4;
      font-size: 18px;
      height: 45px;
      padding-left: 50px;

    }
    .el-input__inner[type="text"]{
      background: url(../../assets/image/user.png) no-repeat 15px 8px;
    }
    .el-input__inner[type="password"]{
      background: url(../../assets/image/password.png) no-repeat 15px 8px;
      margin-top: 10px;
    }
    .el-input__inner[type="text"]:focus{
      background: url(../../assets/image/user_click.png) no-repeat 15px 8px;
      border-image: linear-gradient(to right,#2587ff,#1695ef,#00c3a5) 20 20;
      color: #4398ff;
    }
    .el-input__inner[type="password"]:focus{
      background: url(../../assets/image/password_click.png) no-repeat 15px 8px;
      border-image: linear-gradient(to right,#2587ff,#1695ef,#00c3a5) 20 20;
      color: #4398ff;
    }
  }
</style>
