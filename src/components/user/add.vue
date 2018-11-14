
<!-- 检测单位信息设置 -->
<template lang="html">
    <div class="table">
      <div class="mask">
      </div>

      <!-- 顶部查询条件 -->
      <div class="topquery">
        <el-button  @click="addInfo" v-if="hasPermission('info:add')"><i class="iconfont icon-tianjia"></i>新增</el-button>
      </div>
      <!-- 中间间隔栏 -->
      <div class="interval">
      </div>

      <!-- 底部详细表格 -->
      <div class="detailtab">
        <el-table
        ref="multipleTable"
        stripe
        :data="tableData"
        tooltip-effect="dark"
        :height="addheight"
        style="width: 100%">
         <el-table-column
           prop="username"
           label="用户名"
           align="center">
         </el-table-column>
         <el-table-column
           prop="mobile_phone"
           label="手机号"
           align="center">
         </el-table-column>
         <el-table-column
           prop="province_name"
           label="所在省份"
           align="center">
         </el-table-column>
         <el-table-column
           prop="city_name"
           label="所在市区"
           align="center">
         </el-table-column>
         <el-table-column
           prop="area_name"
           label="所在区或县"
           align="center">
         </el-table-column>
         <el-table-column
           prop="create_time"
           label="创建时间"
           width="200"
           align="center">
         </el-table-column>
         <el-table-column
            prop="tbutton"
            label="查看详情"
            width="200"
            align="center"
            v-if="hasPermission('info:edit')||hasPermission('info:delete')">
            <template slot-scope="scope">
              <span class="editbtn" @click="handleEdit(scope.row)" v-if="hasPermission('info:edit')"><i class="iconfont icon-bianji"></i>编辑</span>
              <span class="editbtn delbtn" @click="handleDelete(scope.row)" v-if="hasPermission('info:delete')"><i class="iconfont icon-shanchu"></i>删除</span>
           </template>
          </el-table-column>
          <el-table-column
             prop="tbutton"
             label="密码"
             width="100"
             align="center"
             v-if="hasPermission('info:edit')">
             <template slot-scope="scope">
               <el-tag size="small" @click.native="editPassword(scope.row)">修改密码</el-tag>
            </template>
           </el-table-column>
       </el-table>

       <!-- 分页器 -->
       <div class="pagin">
         <el-pagination
           background
           @current-change="handleCurrentChange"
           :current-page.sync="currentPage"
           :page-size="this.pagesize"
           layout="total, prev, pager, next ,jumper"
           :total="this.totalnum">
         </el-pagination>
       </div>
      </div>

      <!-- 弹出的模态框 -->
      <el-dialog title="详细信息" :visible.sync="dialogFormVisible" width="700px"  @close='closeForm' :close-on-click-modal="false">
        <div class="formtab">
           <!-- 消防泵参数配置 -->
           <el-form :label-position="labelPosition" label-width="150px" :model="formLabelAlign" ref="ruleForm" :rules="rules">
             <el-form-item label="用户名" prop="username">
               <el-input v-model="formLabelAlign.username"></el-input>
             </el-form-item>
             <el-form-item label="密码" prop="password" v-if="this.flag">
               <el-input v-model="formLabelAlign.password"></el-input>
             </el-form-item>
            <el-form-item label="手机号" prop="mobile_phone">
              <el-input v-model="formLabelAlign.mobile_phone"></el-input>
            </el-form-item>

            <el-form-item label="选择省市区" prop="selectedOptions">
              <el-cascader
                :options="options"
                v-model="formLabelAlign.selectedOptions"
                @change="handleChange">
              </el-cascader>
            </el-form-item>


            <el-form-item label="选择所属站点" prop="sitelist">
              <el-select
                v-model="formLabelAlign.sitelist"
                multiple
                collapse-tags
                placeholder="请选择">
                <el-option
                  v-for="item in sitearr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="账号是否锁定" prop="isLock">
              <el-select v-model="formLabelAlign.isLock" clearable placeholder="请选择">
                <el-option
                  v-for="item in lock"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否是超级管理员" prop="isAdmin">
              <el-select v-model="formLabelAlign.isAdmin" clearable placeholder="请选择">
                <el-option
                  v-for="item in supadmin"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="角色类型" prop="role_id">
              <el-select v-model="formLabelAlign.role_id" clearable placeholder="请选择">
                <el-option
                  v-for="item in roletype"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>

        </div>

       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="confirm">确 定</el-button>
         <el-button @click="dialogFormVisible = false" class="cancel">取 消</el-button>
       </div>
      </el-dialog>

      <!-- 修改密码弹出框 -->
      <el-dialog title="修改密码" :visible.sync="FormVisible" width="600px"  @close='closeForm' :close-on-click-modal="false">
        <div class="formtab password">
           <el-form :label-position="labelPosition" label-width="120px" :model="passwordInfo" ref="ruleForm" :rules="passrules">
             <el-form-item label="原始密码" prop="oldpassword">
               <el-input type="password" v-model="passwordInfo.oldpassword" placeholder="请输入原始密码"></el-input>
             </el-form-item>
            <el-form-item label="新密码" prop="newpassword">
              <el-input type="password" v-model="passwordInfo.newpassword" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="newpasswordconf">
              <el-input type="password" v-model="passwordInfo.newpasswordconf" placeholder="请再次输入新密码"></el-input>
            </el-form-item>
          </el-form>
        </div>

       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="confirmpassword">确 定</el-button>
         <el-button @click="FormVisible = false" class="cancel">取 消</el-button>
       </div>
      </el-dialog>
    </div>

</template>

<script>
import Qs from 'qs'
import { Message } from 'element-ui';
import { regionData,CodeToText } from 'element-china-area-data'


export default {
  data () {
    let confirmpasswordCheck = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入新密码'))
      } else if (value !== this.passwordInfo.newpassword) {
        return callback(new Error('两次输入的密码不一致'))
      } else {
        return callback()
      }
    }
    return {
      id: '',
      flag:'false',
      factory: '',
      model_id: '',
      // 当前默认显示的页数
      currentPage: 1,
      tableData: [{}],
      dialogFormVisible: false,
      FormVisible: false,
      // 数据总条数
      totalnum: 0,
      // 更改后当前页
      nowPage: '',
      // 每页展示的数据量
      pagesize: 10,
      // 存放后台获取数据的数组
      totalsum: [],
      addheight:450,

      // 用户启用状态
      status: true,



      labelPosition: 'right',

      formLabelAlign: {
        username: '',
        password: '',
        mobile_phone: '',
        city_name: '',
        area_name: '',
        province_name: '',
        isLock: '',
        isAdmin: '',
        selectedOptions: [],
        sitelist: [],
        role_id:'',
      },
      passwordInfo: {
        oldpassword: '',
        newpassword: '',
        newpasswordconf: '',
      },

      siteList:[],

      // 省市区三级联动数据
      options: regionData,

      // 是否锁定
      lock: [{
        value: 1,
        label: '锁定'
        },
        {
          value: 0,
          label: '未锁定'
        }],

      // 是否超级管理员
      supadmin: [{
        value: 1,
        label: '是'
        },
        {
          value: 0,
          label: '不是'
        }],

      // 角色类型
      roletype:[],

      // 站点下拉列表
      sitearr: [],



      // 弹出框必填项
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        mobile_phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确' }
        ],
        unit_type: [
          {
            required: true,
            message: '请选择单位类型',
            trigger: 'blur'
          }
        ],
        unit_name: [
          {
            required: true,
            message: '请输入单位名称',
            trigger: 'blur'
          }
        ],
        sitelist: [
          {
            required: true,
            message: '请选择站点',
            trigger: 'blur'
          }
        ],
        isLock: [
          {
            required: true,
            message: '请选择账号是否锁定',
            trigger: 'blur'
          }
        ],
        isAdmin: [
          {
            required: true,
            message: '请选择是否为超级管理员',
            trigger: 'blur'
          }
        ],
        role_id: [
          {
            required: true,
            message: '请选择角色类型',
            trigger: 'blur'
          }
        ],
        selectedOptions: [
          {
            required: true,
            message: '请选择地区',
            trigger: 'blur'
          }
        ],
      },

      passrules: {
        oldpassword: [
          {
            required: true,
            message: '请输入原始密码',
            trigger: 'blur'
          }
        ],
        newpassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }
        ],
        newpasswordconf: [
          {
            required: true,
            validator: confirmpasswordCheck,
            trigger: 'blur'
          }
        ],
      }


    }
  },

  created(){
    this.getuserInfo();
    this.setheight();
  },

  methods: {
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },


    // 页数切换时的回调函数
    handleCurrentChange(val) {
      // 每次切换页面先把数组清空
      this.tableData=[];
      // 取得当前所需要的数据
      for(var i=(val-1)*this.pagesize;i<(val)*this.pagesize;i++){
        var pumpobj={};
        if(this.totalsum[i]){
          pumpobj=this.totalsum[i];
          this.tableData.push(pumpobj)
        }else{
          return
        }
      }
    },

    // 获取用户参数信息
    getuserInfo() {
      // 发送请求获取数据
      // 配置本地代理来实现跨域请求
      if(this.currentPage!=1){
        this.currentPage=this.nowPage;
      }else{
        this.currentPage=1;
      }
      this.$axios.get(process.env.API_HOST+'api/v1/userInfoList')
      .then(res => {
          this.tableData=[];
          this.totalnum = res.data.userPageInfo.list.length;
          this.totalsum = res.data.userPageInfo.list;

          // 页面刷新加载10条数据
          for(var i=(this.currentPage-1)*this.pagesize;i<this.currentPage*this.pagesize;i++){
            var obj={};
            if(res.data.userPageInfo.list[i]){
              obj=res.data.userPageInfo.list[i];
              this.tableData.push(obj)
            }else{
              return
            }
          }

      })
      .catch(error => {
      });
    },

    //弹出模态框
    handleEdit(row) {

      this.flag=false;

      this.dialogFormVisible=true;

      this.$axios.get(process.env.API_HOST+'api/v1/roleuserInfoList?'+Qs.stringify({'id':row.id}))
      .then(res => {
          this.roletype=[];
          // 获得用户角色下拉框数据
          for(var i=0;i<res.data.roleList.length;i++){
            var obj={};
            obj.value=res.data.roleList[i].id;
            obj.label=res.data.roleList[i].name;
            this.roletype.push(obj)
          }

          this.getsitearr();

          var arr=[];
          //
          for(var i=0;i<res.data.user.sitelist.length;i++){
            arr.push(res.data.user.sitelist[i].site_id);
          }
          this.formLabelAlign = res.data.user;

          this.formLabelAlign.sitelist=arr;

          this.formLabelAlign.unit_type=String(this.formLabelAlign.unit_type);
          // 处理省市级数据
          this.formLabelAlign.selectedOptions=[];
          this.formLabelAlign.selectedOptions.push(res.data.user.province_id);
          this.formLabelAlign.selectedOptions.push(res.data.user.city_id);
          this.formLabelAlign.selectedOptions.push(res.data.user.area_id);
          // 处理站点数组数据

      })
      .catch(error => {
        console.log(error);
      });
        return this.id = row.id;
      },

    // 修改信息
    confirm(){
      var params = new URLSearchParams();
      // 需要传入的参数
      params.append('username', this.formLabelAlign.username);
      // params.append('password', this.formLabelAlign.password);
      params.append('mobile_phone', this.formLabelAlign.mobile_phone);
      params.append('city_name', CodeToText[this.formLabelAlign.selectedOptions[1]]);
      params.append('city_id', this.formLabelAlign.selectedOptions[1]);
      params.append('area_name', CodeToText[this.formLabelAlign.selectedOptions[2]]);
      params.append('area_id', this.formLabelAlign.selectedOptions[2]);
      params.append('province_name', CodeToText[this.formLabelAlign.selectedOptions[0]]);
      params.append('province_id', this.formLabelAlign.selectedOptions[0]);
      params.append('isLock', this.formLabelAlign.isLock);
      params.append('isAdmin', this.formLabelAlign.isAdmin);
      params.append('role_id', this.formLabelAlign.role_id);

      for(var i=0;i<this.formLabelAlign.sitelist.length;i++){
        params.append('list', this.formLabelAlign.sitelist[i]);
      }

      // 判断flag如果为true时增加表单信息
      if(this.flag==true){
        params.append('password', this.formLabelAlign.password);

        this.$refs.ruleForm.validate((valid) => {
            if (valid) {

              this.$axios.post(process.env.API_HOST+'api/v1/adduser',
                params
                  )
              .then(res => {
                  console.log(res);
                  if(res.data.status=="SUCCESS"){
                    this.dialogFormVisible = false;
                    this.nowPage=this.currentPage;
                    this.getuserInfo();
                    this.$message.success('添加成功');
                  }else{
                    if(this.$route.path=="/login"){
                    }else {
                      this.$message.error(res.data.message);
                    }
                  }
              })
              .catch(error => {
                if(this.$route.path=="/login"){
                }else {
                  this.$message.error('添加失败');
                }
              });
            } else {
              return false;
            }
          });

      // 判断flag为false时修改表单信息
      }else{

        params.append('id', this.id);

        this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.$axios.put(process.env.API_HOST+'api/v1/updateuser',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getuserInfo();
                  this.$message.success('修改成功');
              })
              .catch(error => {
                if(this.$route.path=="/login"){
                }else {
                  this.$message.error('修改失败');
                }
              });
            } else {
              return false;
            }
          });
      }

    },

    // 删除当前信息
    handleDelete(row) {

      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(process.env.API_HOST+'api/v1/deleteuser',
            Qs.stringify({'id':row.id})
        )
          .then(res => {
              this.nowPage=this.currentPage;
              this.getuserInfo();
              this.$message.success('删除成功');
          })
          .catch(error => {
            if(this.$route.path=="/login"){
            }else {
              this.$message.error('删除失败');
            }
          });
        }).catch(() => {
        });
      },

    // 添加信息
    addInfo(){
      // 弹出模态框
      this.flag=true;
      this.dialogFormVisible=true;
      this.formLabelAlign.password='';

      this.$axios.get(process.env.API_HOST+'api/v1/roleuserInfoList')
      .then(res => {
          this.roletype=[];
          // 获得用户角色下拉框数据
          for(var i=0;i<res.data.roleList.length;i++){
            var obj={};
            obj.value=res.data.roleList[i].id;
            obj.label=res.data.roleList[i].name;
            this.roletype.push(obj)
          }
      })
      .catch(error => {
        console.log(error);
      });
      this.getsitearr();
    },

    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields();
      this.formLabelAlign.selectedOptions=[];
    },

    // 省市区下拉框
    handleChange (value) {
    },

    // 下拉列表单位选择框
    getsitearr(){

      this.$axios.get(process.env.API_HOST+'api/v1/siteListInfo')
      .then(res => {
          this.sitearr=[];
          // 获得用户角色下拉框数据
          for(var i=0;i<res.data.list.length;i++){
            var obj={};
            obj.value=res.data.list[i].id;
            obj.label=res.data.list[i].site_name;
            this.sitearr.push(obj)
          }
      })
      .catch(error => {
        console.log(error);
      });
    },

    // 修改密码
    editPassword(row){
      this.FormVisible=true;
      return this.id=row.id
    },

    // 确认修改密码
    confirmpassword(){
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$axios.post(process.env.API_HOST+'api/v1/updatepwd',
            Qs.stringify({'id':this.id,
            'oldpwd':this.passwordInfo.oldpassword,
            'newpwd':this.passwordInfo.newpassword})
          )
          .then(res => {
              if(res.data.status=="SUCCESS"){
                this.$message.success('修改密码成功');
                this.FormVisible=false;
              }else{
                this.$message.error("原始密码不正确，修改失败");
              }
          })
          .catch(error => {
          });
        } else {
          console.log('submit err')
        }
      })

    },
    // 设置高度
    setheight(){
      var w = screen.availHeight;
      this.addheight = w-374;
    },

  },
}
</script>

<style lang="scss" scoped>

  .warn{
    height: 25px;
  	background-color: #fffbcc;
  	border: solid 2px #e6dc50;
    padding: 10px 30px;
    margin: 10px 0px;
    i{
      font-size: 20px;
      margin-right: 10px;
    }
    span{
      font-size: 16px;
    	letter-spacing: 2px;
    	color: #202133;
    }
  }
  .table{
    position: absolute;
    background-color: #fff;
    width:100%;
    position:absolute;
    top:80px;
    bottom:12px;
    .mask{
      width: 20px;
      height: 100%;
      background-color: #eceffc;
      float: right;
    }
  }

  .topquery{
    padding: 22px 15px 21px 15px;
    .el-button{
      width: 79px;
	    height: 32px;
	    background-color: #5cc560;
	    border-radius: 1px;
      font-size: 14px;
      color: #ffffff;
      padding: 0px;
      border: 0px;
      padding-top: 3px;
      i{
        margin-right: 7px;
        font-size: 14px;
        vertical-align: top;
      }
    }
  }
  .interval{
    height: 10px;
    background-color: #edf0f5;
  }

  .detailtab{
    background-color: #fff;
    margin: 15px;
    margin-right:35px;
    .pagin{
      margin-top: 30px;
      float: right;
    }
    .el-table{
      margin-top: 20px;
    }
  }

  .el-dialog{
    .formtab{
      height: 340px;
      overflow: auto;
      padding: 0 100px 0 20px;
      .el-cascader{
        width: 373px;
      }
      .el-select{
        width: 373px;
      }
    }
    .password{
      height: 200px;
    }

    .dialog-footer{
      text-align: center;
      .el-button{
        width: 86px;
  	    height: 36px;
  	    background-color: #4ea5ef;
  	    border-radius: 3px;
        font-size: 14px;
        color: #ffffff;
        padding: 0px;
        border: 0px;
        padding-top: 2px;
      }
      .cancel{
        background-color: #fff;
        border: 1px solid #ccc;
        color: #606266;
      }
      .cancel:focus, .cancel:hover{
        color: #4ea5ef;
        border-color: #4ea5ef;
      }
    }

  }
  .el-form-item__content{
    .el-button{
      padding: 12px 20px;
      border: 1px solid #ccc;
    }
  }
  .el-tag{
    width: 73px;
  	height: 26px;
  	background-color: #f7f7f7;
  	border-radius: 2px;
  	border: solid 1px #cccccc;
    cursor: pointer;
    font-size: 13px;
    line-height: 26px;
  }
  .tagdel{
    background-color: #fff;
    border: 1.5px solid #4ea5ef;
    color: #4ea5ef;
  }
  .el-radio__input.is-checked .el-radio__inner{
    border-color: #4ea5ef;
    background: #4ea5ef;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #4ea5ef;
  }
  .editbtn{
    margin-right: 6px;
    cursor: pointer;
    i{
      font-size: 20px;
      color: #4ea5ef;
      vertical-align: middle;
      margin-right: 3px;
    }
  }
  .delbtn{
    i{
      color: #b9b9b9;
    }
  }

</style>
<style lang="scss">
  .el-checkbox__inner:hover{
    border-color: #4ea5ef;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #4ea5ef;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #4ea5ef;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #4ea5ef;
    border-color: #4ea5ef;
  }
  .el-radio__input.is-checked .el-radio__inner{
    border-color: #4ea5ef;
    background: #4ea5ef;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #4ea5ef;
  }
</style>
