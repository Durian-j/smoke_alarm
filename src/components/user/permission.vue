
<!-- 检测单位信息设置 -->
<template lang="html">
    <div class="table">
      <div class="mask">
      </div>

      <!-- 顶部查询条件 -->
      <div class="topquery">
        <el-button @click="addInfo" v-if="hasPermission('permission:add')"><i class="iconfont icon-tianjia"></i>新增</el-button>
      </div>
      <!-- 中间间隔栏 -->
      <div class="interval">
      </div>

      <!-- 底部详细表格 -->
      <div class="detailtab">
        <el-table
         :data="tableData"
         :height="perheight"
         style="width: 100%">
         <el-table-column
           prop="name"
           label="资源名称"
           align="center">
         </el-table-column>
         <el-table-column
           prop="type"
           label="资源类型"
           width="120"
           align="center">
           <template slot-scope="scope">
             <el-tag v-show="scope.row.type=='0'" type="info" size="medium" style="padding:0 15px">目录</el-tag>
             <el-tag v-show="scope.row.type=='1'" type="success" size="medium" style="padding:0 15px">菜单</el-tag>
             <el-tag v-show="scope.row.type=='2'" size="medium" style="padding:0 15px">按钮</el-tag>
          </template>
         </el-table-column>

         <el-table-column
           prop="url"
           label="访问url地址"
           align="center">
         </el-table-column>
         <el-table-column
           prop="perms"
           label="权限代码字符串"
           align="center">
         </el-table-column>
         <el-table-column
           prop="parent_name"
           label="父节点名称"
           align="center">
         </el-table-column>
         <el-table-column
            prop="tbutton"
            label="查看详情"
            width="150"
            align="center"
            v-if="hasPermission('permission:edit')||hasPermission('permission:delete')">
            <template slot-scope="scope">
              <span class="editbtn" @click="handleEdit(scope.row)" v-if="hasPermission('permission:edit')"><i class="iconfont icon-bianji"></i>编辑</span>
              <span class="editbtn delbtn" @click="handleDelete(scope.row)" v-if="hasPermission('permission:delete')"><i class="iconfont icon-shanchu"></i>删除</span>
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
           <el-form :label-position="labelPosition" label-width="200px" :model="formLabelAlign" ref="ruleForm" :rules="rules">
            <el-form-item label="选择单位类型" prop="type">
              <el-radio-group v-model="formLabelAlign.type" @change="changeType">
                <el-radio label="0">目录</el-radio>
                <el-radio label="1">菜单</el-radio>
                <el-radio label="2">按钮</el-radio>
              </el-radio-group>

            </el-form-item>

            <el-form-item label="节点名称" prop="name">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>

            <el-form-item label="标识" prop="mark">
              <el-input v-model="formLabelAlign.mark"></el-input>
            </el-form-item>

            <el-form-item v-if="formLabelAlign.type=='1'||formLabelAlign.type=='2'" label="上级节点" prop="parent_id">
              <el-select v-model="formLabelAlign.parent_id" clearable placeholder="请选择" @change="changeValue">
                <el-option
                  v-for="item in menu"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item v-if="formLabelAlign.type=='1'" label="URL" prop="url">
              <el-input v-model="formLabelAlign.url"></el-input>
            </el-form-item>

            <el-form-item v-if="formLabelAlign.type=='1'||formLabelAlign.type=='2'" label="授权标识" prop="perms">
              <el-input v-model="formLabelAlign.perms"></el-input>
            </el-form-item>

            <el-form-item label="排序号" prop="sort">
              <el-input-number v-model="formLabelAlign.sort" size="medium" controls-position="right"></el-input-number>
            </el-form-item>


          </el-form>

        </div>

       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="confirm">确 定</el-button>
         <el-button @click="dialogFormVisible = false" class="cancel">取 消</el-button>
       </div>
     </el-dialog>
    </div>

</template>

<script>
import Qs from 'qs'
import { Message } from 'element-ui';

export default {
  data () {
    return {
      id: '',
      flag:'false',
      // 当前默认显示的页数
      currentPage: 1,

      // 更改后当前页
      nowPage: '',

      tableData: [],
      dialogFormVisible: false,
      // 数据总条数
      totalnum: 0,
      // 每页展示的数据量
      pagesize: 10,
      // 存放后台获取数据的数组
      totalsum: [],
      perheight:450,


      labelPosition: 'right',

      formLabelAlign: {
        type:'0',
        sort: 0,
        parent_id: '',
        parent_name: '',
        url: '',
        perms: '',
        sort: '',
        name: '',
        mark: ''
      },

      // 菜单
      menu: [],

      // 按钮
      btn:[],


      // 弹出框必填项
      rules: {
        name: [
          {
            required: true,
            message: '请输入资源名称',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择资源类型',
            trigger: 'blur'
          }
        ],
        unit_type: [
          {
            required: true,
            message: '请选择单位类型',
            trigger: 'blur'
          }
        ],
        parent_id: [
          {
            required: true,
            message: '请选择上级节点名称',
            trigger: 'blur'
          }
        ],
      }
    }
  },

  created(){
    this.getjurInfo();
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

    // 获取权限参数信息
    getjurInfo() {
      // 发送请求获取数据
      // 配置本地代理来实现跨域请求
      if(this.currentPage!=1){
        this.currentPage=this.nowPage;
      }else{
        this.currentPage=1;
      }

      this.$axios.get(process.env.API_HOST+'api/v1/permissionInfoList')
      .then(res => {
          this.tableData=[];
          this.totalnum = res.data.permissionPageInfo.length;
          this.totalsum = res.data.permissionPageInfo;

          // 页面刷新加载10条数据
          for(var i=(this.currentPage-1)*this.pagesize;i<this.currentPage*this.pagesize;i++){
            var obj={};
            if(res.data.permissionPageInfo[i]){
              obj=res.data.permissionPageInfo[i];
              this.tableData.push(obj);
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

      this.$axios.get(process.env.API_HOST+'api/v1/permissionTreeList?'+Qs.stringify({'id':row.id}))
      .then(res => {
          this.formLabelAlign.parent_name='';
          this.formLabelAlign=res.data.permission;

          this.$axios.get(process.env.API_HOST+'api/v1/getPermissionList?'+Qs.stringify({'type':row.type}))
          .then(res => {
              // 获得菜单父级权限
              this.menu=[];
              for(var i=0;i<res.data.permissionList.length;i++){
                var obj={};
                obj.value=res.data.permissionList[i].id;
                obj.label=res.data.permissionList[i].name;
                this.menu.push(obj)
              }
          })
          .catch(error => {
            console.log(error);
          });

      })
      .catch(error => {
        console.log(error);
      });
        return this.id = row.id;
      },

    // 修改消防泵信息
    confirm(){
      var params = new URLSearchParams();
      // 需要传入的参数
      params.append('type', this.formLabelAlign.type);
      params.append('name', this.formLabelAlign.name);
      params.append('parent_id', this.formLabelAlign.parent_id);
      params.append('url', this.formLabelAlign.url==null?" ":this.formLabelAlign.url);
      params.append('perms', this.formLabelAlign.perms==null?" ":this.formLabelAlign.perms);
      params.append('sort', this.formLabelAlign.sort);
      params.append('parent_name', this.formLabelAlign.parent_name==null? " " : this.formLabelAlign.parent_name);
      params.append('mark', this.formLabelAlign.mark);
      // 判断flag如果为true时增加表单信息
      if(this.flag==true){

        this.$refs.ruleForm.validate((valid) => {
            if (valid) {

              this.$axios.post(process.env.API_HOST+'api/v1/addpermission',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getjurInfo();
                  this.$message.success('添加成功');
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
              this.$axios.put(process.env.API_HOST+'api/v1/updatepermission',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getjurInfo();
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

    // 获取菜单下拉框的label值
    changeValue(value) {
      let obj = {};
      obj = this.menu.find((item)=>{
          return item.value === value;
      });
      return this.formLabelAlign.parent_name=obj.label;
    },

    // 获取按钮下拉框的label值
    changeValue(value) {
      let obj = {};
      obj = this.menu.find((item)=>{
          return item.value === value;
      });
      return this.formLabelAlign.parent_name=obj.label;
    },

    // 删除当前信息
    handleDelete(row) {

      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(process.env.API_HOST+'api/v1/deletepermission',
            Qs.stringify({'id':row.id})
              )
          .then(res => {
              this.nowPage=this.currentPage;
              this.getjurInfo();
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
      // this.getparent();
    },

    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields();
      this.formLabelAlign.parent_id='';
      this.formLabelAlign.parent_name='';
      this.formLabelAlign.perms='';
      this.formLabelAlign.url='';
    },

    // 改变radio值
    changeType(val){
      this.$axios.get(process.env.API_HOST+'api/v1/getPermissionList?'+Qs.stringify({'type':val}))
      .then(res => {
          // 获得菜单父级权限
          this.menu=[];
          for(var i=0;i<res.data.permissionList.length;i++){
            var obj={};
            obj.value=res.data.permissionList[i].id;
            obj.label=res.data.permissionList[i].name;
            this.menu.push(obj)
          }
      })
      .catch(error => {
        console.log(error);
      });
    },
    // 设置高度
    setheight(){
      var w = screen.availHeight;
      this.perheight = w-374;
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
    margin-right: 35px;
    .pagin{
      margin-top: 30px;
      float: right;
    }
    .el-table{
      margin-top: 20px;
    }
  }

  .el-tag{
    padding: 0 5px;
    cursor: pointer;
    display: inline-block;
  }


  .el-dialog{

    .formtab{
      height: 340px;
      overflow: auto;
      .el-input{
        width: 300px;
      }
      .el-form{
        float: left;
      }
      .el-cascader{
        width: 300px;
      }
      .el-select{
        width: 300px;
      }
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
  .tagedit{
    color: #fff;
    background-color: #4ea5ef;
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
<style>
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
