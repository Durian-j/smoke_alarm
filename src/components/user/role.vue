
<!-- 检测单位信息设置 -->
<template lang="html">
    <div class="table">
      <div class="mask">
      </div>

      <!-- 顶部查询条件 -->
      <div class="topquery">
        <el-button @click="addInfo" v-if="hasPermission('role:add')"><i class="iconfont icon-tianjia"></i>新增</el-button>
      </div>
      <!-- 中间间隔栏 -->
      <div class="interval">
      </div>

      <!-- 底部详细表格 -->
      <div class="detailtab">
        <el-table
         :data="tableData"
         :height="roleheight"
         style="width: 100%">
         <el-table-column
           prop="name"
           label="角色名"
           align="center">
         </el-table-column>
         <el-table-column
           prop="perms"
           label="角色标识"
           align="center">
         </el-table-column>
         <el-table-column
           prop="remark"
           label="备注"
           align="center">
         </el-table-column>
         <el-table-column
            prop="tbutton"
            label="查看详情"
            align="center"
            v-if="hasPermission('role:edit')||hasPermission('role:delete')">
            <!-- 按钮 -->
            <template slot-scope="scope">
              <span class="editbtn" @click="handleEdit(scope.row)" v-if="hasPermission('role:edit')"><i class="iconfont icon-bianji"></i>编辑</span>
              <span class="editbtn delbtn" @click="handleDelete(scope.row)" v-if="hasPermission('role:delete')"><i class="iconfont icon-shanchu"></i>删除</span>
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
      <el-dialog title="详细信息" :visible.sync="dialogFormVisible" width="620px"  @close='closeForm' :close-on-click-modal="false">
        <div class="formtab">
           <!-- 消防泵参数配置 -->
           <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" ref="ruleForm" :rules="rules" v-loading="loading">
             <el-form-item label="角色名" prop="name">
               <el-input v-model="formLabelAlign.name"></el-input>
             </el-form-item>
            <el-form-item label="角色标识" prop="perms">
              <el-input v-model="formLabelAlign.perms"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formLabelAlign.remark"></el-input>
            </el-form-item>

            <el-form-item label="角色授权">
              <el-tree
                :data="data3"
                show-checkbox
                node-key="id"
                ref="tree"
                default-expand-all>
              </el-tree>
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
      factory: '',
      model_id: '',
      // 当前默认显示的页数
      currentPage: 1,
      // 更改后当前页
      nowPage: '',
      tableData: [],
      dialogFormVisible: false,
      // 数据总条数
      totalnum: 0,
      // 每页展示的数据量
      pagesize: 15,
      // 存放后台获取数据的数组
      totalsum: [],

      data3: [],
      roleheight:450,



      labelPosition: 'right',

      formLabelAlign: {
        name: '',
        perms: '',
        remark: '',
        permissionIds: '',
      },

      loading: true,

      // 弹出框必填项
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名',
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

    // 获取角色参数信息
    getuserInfo() {
      // 发送请求获取数据
      // 配置本地代理来实现跨域请求
      if(this.currentPage!=1){
        this.currentPage=this.nowPage;
      }else{
        this.currentPage=1;
      }
      this.$axios.get(process.env.API_HOST+'api/v1/roleInfoList')
      .then(res => {
          this.tableData=[];
          this.totalnum = res.data.rolePageInfo.list.length;
          this.totalsum = res.data.rolePageInfo.list;

          // 页面刷新加载10条数据
          for(var i=(this.currentPage-1)*this.pagesize;i<this.currentPage*this.pagesize;i++){
            var obj={};
            if(res.data.rolePageInfo.list[i]){
              obj=res.data.rolePageInfo.list[i];
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
      this.loading=true;

      this.dialogFormVisible=true;

      this.$axios.get(process.env.API_HOST+'api/v1/roleTreeList?'+Qs.stringify({'id':row.id}))
      .then(res => {
          this.loading=false;
          this.formLabelAlign=res.data.role;
          this.data3=res.data.treeNodeList;
          this.formLabelAlign.permissionIds=res.data.permissionIds;
          function removeByValue(arr, val) {
            for(var i=0; i<arr.length; i++) {
              if(arr[i] == val) {
                arr.splice(i, 1);
                break;
              }
            }
          }
          var array=this.formLabelAlign.permissionIds;
          removeByValue(array, 31);
          removeByValue(array, 32);
          removeByValue(array, 37);
          removeByValue(array, 38);
          removeByValue(array, 43);
          removeByValue(array, 44);
          removeByValue(array, 49);
          removeByValue(array, 54);
          removeByValue(array, 55);
          this.$refs.tree.setCheckedKeys(array);

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
      params.append('name', this.formLabelAlign.name);
      params.append('perms', this.formLabelAlign.perms);
      params.append('remark', this.formLabelAlign.remark);
      params.append('permissionIds', this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys()));

      // 判断flag如果为true时增加表单信息
      if(this.flag==true){

        this.$refs.ruleForm.validate((valid) => {
            if (valid) {

              this.$axios.post(process.env.API_HOST+'api/v1/addrole',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getuserInfo();
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
              this.$axios.put(process.env.API_HOST+'api/v1/updaterole',
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
          this.$axios.post(process.env.API_HOST+'api/v1/deleterole',
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
      this.loading=true;
      this.gettree();
    },

    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields();
      this.data3=[];
      this.$refs.tree.setCheckedKeys([]);
    },

    // 获取树形下拉框
    gettree(){
      this.$axios.get(process.env.API_HOST+'api/v1/roleTreeList')
      .then(res => {
        this.data3=res.data.treeNodeList;
        this.loading=false;
      })
      .catch(error => {
        console.log(error);
      });
    },
    // 设置高度
    setheight(){
      var w = screen.availHeight;
      this.roleheight = w-374;
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
      padding: 0 100px 0 30px;
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
  .el-tag{
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
    margin-right: 16px;
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
  .el-tree{
    margin-top: 8px;
  }

  .el-tree-node__label:before {
    display: inline-block;
    content: url(../../assets/file.png);
    margin-right: 5px;
    vertical-align: top;
    padding-top: 10px;
    line-height: 20px;

  }

  .el-tree-node__children .el-tree-node__children .el-tree-node__label:before{
    display: inline-block;
    content: url(../../assets/doc.png);
  }
  .el-loading-spinner .path{
    stroke: #4ea5ef;
  }
</style>
