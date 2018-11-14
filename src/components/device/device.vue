
<!-- 检测单位信息设置 -->
<template lang="html">
    <div class="table">

      <div class="mask">
      </div>

      <!-- 顶部查询条件 -->
      <div class="topquery">
        <!-- <div class="select devicequery" v-if="!this.$route.query.id">
          <div class="site">
            <p>根据站点名称查询:</p>
            <el-select v-model="siteId" placeholder="请选择站点查询" clearable >
              <el-option
                v-for="item in siteoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="site">
            <p>根据设备id查询:</p>
            <el-input
              placeholder="请输入设备id查询"
              v-model="number"
              clearable>
            </el-input>
          </div>
          <div class="site">
            <p>根据序列号查询:</p>
            <el-input
              placeholder="请输入序列号查询"
              v-model="serial_number"
              clearable>
            </el-input>
          </div>
        </div> -->

        <div class="select" v-if="!this.$route.query.id">
          <div class="btn">
            <el-button class="addbtn" @click="addInfo" v-if="hasPermission('device:add')"><i class="iconfont icon-tianjia"></i>新增</el-button>
            <el-button class="delbtn" @click="handleDelete" v-if="hasPermission('device:delete')"><i class="iconfont icon-shachu-xue"></i>删除</el-button>
            <el-button class="upbtn" @click="uploadfile"><i class="iconfont icon-unie123"></i>上传</el-button>
          </div>

          <div class="query devicename">
            <!-- <div class="site">
              <p>根据报警状态查询:</p>
              <el-select v-model="alarm" clearable placeholder="请选择报警状态查询">
                <el-option
                  v-for="item in alarmwarn"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="site devicename">
              <p>根据电池状态查询:</p>
              <el-select v-model="battery_status" clearable placeholder="请选择电池状态查询">
                <el-option
                  v-for="item in battery"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div> -->
            <el-popover
              ref="popover5"
              placement="bottom"
              width="400"
              trigger="click">
              <div class="termcon">
                 <el-form :label-position="labelPosition" label-width="150px">
                   <el-form-item label="根据站点名称查询:">
                     <el-select v-model="siteId" placeholder="请选择站点查询" clearable >
                       <el-option
                         v-for="item in siteoptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
                     </el-select>
                   </el-form-item>
                   <el-form-item label="根据设备id查询:">
                     <el-input v-model="number" placeholder="请输入设备id查询"></el-input>
                   </el-form-item>
                   <el-form-item label="根据序列号查询:">
                     <el-input v-model="serial_number" placeholder="请输入序列号查询"></el-input>
                   </el-form-item>
                   <!-- <el-form-item label="根据报警状态查询:">
                     <el-select v-model="alarm" clearable placeholder="请选择报警状态查询">
                       <el-option
                         v-for="item in alarmwarn"
                         :key="item.vlaue"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
                     </el-select>
                   </el-form-item>
                   <el-form-item label="根据电池状态查询:">
                     <el-select v-model="battery_status" clearable placeholder="请选择电池状态查询">
                       <el-option
                         v-for="item in battery"
                         :key="item.vlaue"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
                     </el-select>
                   </el-form-item> -->
                </el-form>

              </div>
            </el-popover>
            <div class="queryterm" v-popover:popover5>
              <i class="iconfont icon-chazhao"></i>
              请选择表格查询的筛选条件
            </div>

            <div class="querybtn">
              <el-button class="upbtn" @click="getDeviceList">查 询</el-button>
            </div>
          </div>

        </div>
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
          :height="this.deviceheight"
          :default-sort = "{prop: 'name', order: 'descending'}"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            label="站点名称"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.site_name }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="采集设备名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="number"
            label="设备id"
            align="center">
          </el-table-column>
          <el-table-column
            prop="serial_number"
            label="序列号"
            align="center">
          </el-table-column>

          <el-table-column
            prop="alarm"
            label="烟感状态"
            show-overflow-tooltip
            align="center"
            width="150">

          </el-table-column>
          <el-table-column
            prop="battery_status"
            label="电池状态"
            show-overflow-tooltip
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
              prop="tbutton"
              label="查看详情"
              width="120"
              align="center"
              v-if="hasPermission('device:edit')">
              <!-- 按钮 -->
              <template slot-scope="scope">
                <el-tag size="small" @click.native="handleEdit(scope.row)">查看信息</el-tag>
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

           <!-- 被检测单位 -->

           <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" ref="ruleForm" :rules="rules" v-loading="loading">

            <el-form-item label="站点及建筑" prop="selectedOptions">
              <el-cascader
                :options="options"
                v-model="formLabelAlign.selectedOptions"
                @change="handleChange">
              </el-cascader>
            </el-form-item>

            <el-form-item label="安装位置" prop="address">
              <el-input v-model="formLabelAlign.address"></el-input>
            </el-form-item>

            <el-form-item label="设备名称" prop="name">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>

            <el-form-item label="设备id" prop="number">
              <el-input v-model="formLabelAlign.number"></el-input>
            </el-form-item>

            <el-form-item label="序列号" prop="serial_number">
              <el-input v-model="formLabelAlign.serial_number"></el-input>
            </el-form-item>


            <el-form-item label="设备编码" prop="deviceid">
              <!-- <el-input v-model="formLabelAlign.deviceid"></el-input> -->
              <el-select v-model="formLabelAlign.deviceid" placeholder="请选择设备编码" clearable @focus="warndevice">
                <el-option
                  v-for="item in device_id"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="设备厂家名称" prop="factory">
              <el-input v-model="formLabelAlign.factory"></el-input>
            </el-form-item>

            <!-- <el-form-item label="是否报警" prop="alarm">
              <el-select v-model="formLabelAlign.alarm" clearable placeholder="请选择">
                <el-option
                  v-for="item in alarmwarn"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="电池状态" prop="battery_status">
              <el-select v-model="formLabelAlign.battery_status" clearable placeholder="请选择">
                <el-option
                  v-for="item in battery"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->

          </el-form>

        </div>

       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="confirm">确 定</el-button>
         <el-button @click="dialogFormVisible = false" class="cancel">取 消</el-button>
       </div>
      </el-dialog>

      <!-- 上传excel弹出框 -->
      <el-dialog
        title="上传文件"
        :visible.sync="excelfile"
        width="620px">
        <div class="fileload">
          <div class="imgexp">
            <img src="../../assets/example.png" alt="" width="100%">
            <div class="explainword">
              请严格按照如图所示的格式填写excel表格之后上传文件
            </div>
          </div>
          <div class="xlsfile">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="/api/v1/numberInfoadd"
                    :on-preview="handlePreview"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :auto-upload = 'false'
                    :on-success = 'handleSuccess'
                    :data="form"
                    name="file">
                <el-button slot="trigger" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
              </el-upload>
            </el-upload>
          </div>
        </div>
      </el-dialog>

    </div>

</template>

<script>
import Qs from 'qs'
import { Message } from 'element-ui';
// var token =  localStorage.getItem('token')


export default {
  data() {
      return {
        id: '',
        flag:'false',
        siteId:this.$route.query.id||'',
        number:'',
        serial_number:'',
        alarm:'',
        battery_status:'',
        building: '',
        buildingflr: '',
        building_id: '',
        delarr: [],
        deviceheight: 400,
        // 列表中的数据
        tableData: [],
        siteoptions: [],
        device_id: [],

        dialogFormVisible: false,
        excelfile: false,
        // myHeaders: {authorization: token},


        labelPosition: 'right',

        formLabelAlign: {
          site_id: '',
          name: '',
          number: '',
          serial_number: '',
          address: '',
          deviceid: '',
          building_id: '',
          floor_id: '',
          factory: '',
          alarm: '',
          battery_status: '',
          selectedOptions: [],
        },

        options:[],

        rules: {
          selectedOptions: [
            {
              required: true,
              message: '请选择站点',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '请输入设备名称',
              trigger: 'blur'
            }
          ],
          deviceid: [
            {
              required: true,
              message: '请输入采集设备编码',
              trigger: 'blur'
            }
          ],
          building_id: [
            {
              required: true,
              message: '请输入建筑物名',
              trigger: 'blur'
            }
          ],
          floor_id: [
            {
              required: true,
              message: '请输入楼层名',
              trigger: 'blur'
            }
          ]
        },


        // 当前默认显示的页数
        currentPage: 1,
        // 更改后当前页
        nowPage: '',
        // 数据总条数
        totalnum: 0,
        // 每页展示的数据量
        pagesize: 10,
        // 存放后台获取数据的数组
        totalsum: [],

        // 是否报警
        alarmwarn: [{
          value: 1,
          label: '正常'
          },
          {
            value: 2,
            label: '报警'
          }],

        // 电池状态
        battery: [{
          value: 1,
          label: '正常'
          },
          {
            value: 0,
            label: '电量不足'
          }],

        fileList:[],
        form:{
            type:'1'
        },

        loading: true,

      }
    },

  created(){
    this.getDeviceList();
    // this.getinfo();
    this.setheight();
    // this.getsiteinfolist();
  },
  mounted(){

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
    // 获取站点信息
    getDeviceList() {
      // 获取vue地址栏参数id的值

      // 发送请求获取数据
      // 配置本地代理来实现跨域请求
      if(this.currentPage!=1){
        this.currentPage=this.nowPage;
      }else{
        this.currentPage=1;
      }

      this.$axios.get(process.env.API_HOST+'api/v1/collectionInfoList?'
      +Qs.stringify({
        'site_id':this.siteId,
        'number':this.number,
        'serial_number':this.serial_number,
        // 'alarm':this.alarm,
        // 'battery_status':this.battery_status,
        })
        )
      .then(res => {
          this.getsiteinfolist();
          this.tableData=[];
          this.totalnum = res.data.collectionInfoList.length;
          this.totalsum = res.data.collectionInfoList;
          for(var i=0;i<this.totalsum.length;i++){
            if(this.totalsum[i].alarm==2){
              this.totalsum[i].alarm="报警"
            }else{
              this.totalsum[i].alarm="正常"
            }
            if(this.totalsum[i].battery_status==0){
              this.totalsum[i].battery_status="电量不足"
            }else{
              this.totalsum[i].battery_status="正常"
            }
          }
          // 页面刷新加载10条数据
          for(var i=(this.currentPage-1)*this.pagesize;i<this.currentPage*this.pagesize;i++){
            var pumpobj={};
            if(res.data.collectionInfoList[i]){
              pumpobj=res.data.collectionInfoList[i];
              this.tableData.push(pumpobj)
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
      this.getDeviceId();

      this.$axios.get(process.env.API_HOST+'api/v1/collectionInfo?'+Qs.stringify({'id':row.id})
          )
      .then(res => {
          this.formLabelAlign = res.data.collectionInfo;
          var array=[];
          array.push(res.data.collectionInfo.site_id);
          array.push(res.data.collectionInfo.building_id);
          array.push(res.data.collectionInfo.floor_id);
          this.formLabelAlign.selectedOptions=array;
          this.getinfo();
      })
      .catch(error => {
        console.log(error);
      });
        return this.id = row.id;
      },

    // 修改单位信息
    confirm(){

      var params = new URLSearchParams();

      // 需要传入的参数
      params.append('site_id', this.formLabelAlign.selectedOptions[0]==undefined?" ":this.formLabelAlign.selectedOptions[0]);
      params.append('name', this.formLabelAlign.name);
      params.append('number', this.formLabelAlign.number);
      params.append('serial_number', this.formLabelAlign.serial_number);
      params.append('address', this.formLabelAlign.address);
      params.append('deviceid', this.formLabelAlign.deviceid);
      params.append('building_id', this.formLabelAlign.selectedOptions[1]==undefined?" ":this.formLabelAlign.selectedOptions[1]);
      params.append('floor_id', this.formLabelAlign.selectedOptions[2]==undefined?" ":this.formLabelAlign.selectedOptions[2]);
      params.append('factory', this.formLabelAlign.factory);
      // params.append('alarm', this.formLabelAlign.alarm);
      // params.append('battery_status', this.formLabelAlign.battery_status);

      // 判断flag如果为true时增加表单信息
      if(this.flag==true){

        this.$refs.ruleForm.validate((valid) => {
            if (valid) {

              this.$axios.post(process.env.API_HOST+'api/v1/addcollectionInfo',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getDeviceList();
                  this.$message.success('添加设备成功');
              })
              .catch(error => {
                if(this.$route.path=="/login"){
                }else{
                  this.$message.error('添加设备失败');
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
              this.$axios.post(process.env.API_HOST+'api/v1/updatecollectionInfo',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getDeviceList();
                  this.$message.success('修改设备成功');
              })
              .catch(error => {
                if(this.$route.path=="/login"){
                }else{
                  this.$message.error('修改设备失败');
                }
              });

            } else {
              return false;
            }
          });
      }

    },

    // 删除当前信息
    handleDelete() {

      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(process.env.API_HOST+'api/v1/deletecollectionInfo?id='+this.delarr
              )
          .then(res => {
              this.nowPage=this.currentPage;
              this.getDeviceList();
              this.$message.success('删除设备成功');
          })
          .catch(error => {
            if(this.$route.path=="/login"){
            }else{
              if(this.$route.path=="/login"){
              }else{
                this.$message.error('删除设备失败');
              }
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
      this.formLabelAlign.selectedOptions=[];
      this.getDeviceId();
      this.getinfo();
    },

    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },

    // 站点三级联动
    handleChange(value) {
    },
    // 获得站点下拉列表
    getinfo(){
      this.$axios.get(process.env.API_HOST+'api/v1/TreeList'
          )
      .then(res => {
          this.options=res.data.arrayTree[0];
          this.loading=false;
      })
      .catch(error => {
      });
    },

    // 表格前面选择框值改变的方法
    handleSelectionChange(val) {
      this.delarr=[];
      for(var i=0;i<val.length;i++){
        this.delarr.push(val[i].id)
      }
    },

    // 改变表格高度
    setheight(){
      if(this.$route.query.id){
        this.deviceheight=500;
      }
    },

    // 上传文件
    uploadfile(){
      this.excelfile=true;
    },
    // 上传表格的方法
    submitUpload() {
        this.$refs.upload.submit();
    },

    beforeAvatarUpload(file) {

        let Xls = file.name.split('.');

        if(Xls[1] === 'xlsx'){
            return file
        }else {
            this.$message.error('上传文件只能是 xlsx 格式!')
            return false
        }

    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleSuccess(res,file,fileList){

        if(res.status=="SUCCESS"){
            this.$message({
                message: '上传成功！',
                type: 'success'
            });
        }else {
            this.$message({
                message: "excel格式不正确，请核对后再上传",
                type: 'error'
            });
        }

    },

    // 设置高度
    setheight(){
      var w = screen.availHeight;
      this.deviceheight = w-374;
    },
    // 获取站点下拉框
    getsiteinfolist(){
      this.siteoptions=[];
      this.$axios.post(process.env.API_HOST+'api/v1/siteInfoList')
      .then(res => {
          for(let i=0;i<res.data.siteList.length;i++){
            let obj={};
            obj.value=res.data.siteList[i].id;
            obj.label=res.data.siteList[i].site_name;
            this.siteoptions.push(obj)
          }
      })
      .catch(error => {});
    },

    // 获取设备编码下拉框
    getDeviceId(){
      this.device_id=[];
      this.$axios.get(process.env.API_HOST+'api/v1/numberInfoList')
      .then(res => {
          for(let i=0;i<res.data.nodeNumbers.length;i++){
            let obj={};
            obj.value=res.data.nodeNumbers[i].deviceid;
            obj.label=res.data.nodeNumbers[i].deviceid;
            this.device_id.push(obj)
          }
      })
      .catch(error => {});
    },

    // 没有获取到设备列表的提示信息
    warndevice(){
      if(this.device_id.length==0){
        this.$message.warning('请先上传excel文件获取设备id列表信息')
      }
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
    .delbtn{
      background-color: #f7ad4e;
    }
    .upbtn{
      background-color: #4ea5ef;
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
  .el-dialog{

    .formtab{
      height: 350px;
      overflow: auto;
      padding: 0 90px 0 50px;
      .el-button{
        display: inline-block;
      }
      .edit{
        color: #fff;
        background-color: #4ea5ef;
      }
      .el-select{
        width: 323px;
      }
      .el-cascader{
        width: 323px;
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

    .building{
      height: 400px;
      overflow: auto;
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

  .select{
    div{
      display: inline-block;
    }
    .site{
      margin-right: 30px;
    }
    p{
      display: inline-block;
      color: #565656;
      margin-right: 15px;
      font-size: 15px;
    }
    .query{
      float: right;
      margin-right: 20px;
    }
  }
  .site{
    .el-input{
      width: 200px;
    }
  }
  .hidden{
    display: none;
  }
  .devicequery{
    margin-bottom: 20px;
  }

  .fileload{
    height: 450px;
    overflow: auto;
    .imgexp{
      width: 75%;
      margin-left: 60px;
      .explainword{
        margin: 20px;
        color: red;
      }
    }
    .xlsfile{
      height: 200px;
      width: 75%;
      margin-left: 60px;
      .el-button{
        font-size: 13px;
        padding: 0px;
        width: 79px;
        height: 32px;
        border-radius: 2px;
      }
    }
    .el-upload__tip{
      margin-top: 20px;
      width: 250px;
      font-size: 13px;
    }
  }
  .queryterm{
    cursor: pointer;
    margin-right: 10px;
    display: none!important;
    width: 270px;
  	height: 30px;
  	background-color: #f8f8f8;
  	border: solid 1px #e3e3e3;
    font-size: 14px;
    color: #4294f8;
    vertical-align: top;
    line-height: 32px;
    padding-left: 10px;
    .iconfont{
      font-size: 18px;
      vertical-align: middle;
      color: #c1c1c1;
      margin-right: 5px;
    }
  }
  .query{
    .site{
        display: none;
    }
  }
  .select{
    .site{
      display: none;
    }
    .queryterm{
      display: inline-block!important;
    }
  }
  @media screen and (max-width:1455px){
    .query{
      .site{
          display: none;
      }
    }
    .select{
      .site{
        display: none;
      }
      .queryterm{
        display: inline-block!important;
      }
    }
  }
  .el-popover{
    .termcon{
      .el-input{
        width: 220px!important;
      }
      .el-select{
        width: 220px!important;
      }
    }
  }
  .termcon{
    margin: 30px 30px 30px 0;
  }


</style>
<style lang="scss">
  .devicename{
    .el-input__inner{
      width: 180px;
    }
  }
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
  .el-loading-spinner .path{
    stroke: #4ea5ef;
  }

</style>
