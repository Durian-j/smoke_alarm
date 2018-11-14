
<!-- 检测单位信息设置 -->
<template lang="html">
    <div class="table sited">

      <div class="mask">
      </div>
      <!-- 顶部查询条件 -->
      <div class="topquery">
        <div class="select">
          <div class="btn">
            <el-button @click="addInfo" v-if="hasPermission('site:add')"><i class="iconfont icon-tianjia"></i>新增</el-button>
            <el-button class="delbtn" @click="handleDelete" v-if="hasPermission('site:delete')"><i class="iconfont icon-shanchu"></i>删除</el-button>
          </div>
          <div class="query">
            <div class="site">
              <span class="term">查询条件:</span>
              <p>根据站点名称查询:</p>
              <el-select v-model="site_name" placeholder="请选择站点查询" clearable >
                <el-option
                  v-for="item in siteoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

            </div>
            <div class="site">
              <p>根据省市区查询:</p>
              <el-cascader
                size="large"
                :options="options"
                v-model="selectedOptions"
                placeholder="请选择省市区查询">
              </el-cascader>
            </div>
            <el-button class="upbtn" @click="getSiteList">查 询</el-button>
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
          :height="siteheight"
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
            show-overflow-tooltip
            align="center">
            <template slot-scope="scope">{{ scope.row.site_name }}</template>
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
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="详细地址"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <!-- <el-table-column
            prop="longitude"
            label="百度经度"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="latitude"
            label="百度经度"
            show-overflow-tooltip
            align="center">
          </el-table-column> -->
          <el-table-column
            prop="num"
            label="烟感数量"
            show-overflow-tooltip
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
              prop="tbutton"
              label="查看详情"
              width="120"
              align="center"
              v-if="hasPermission('site:edit')">
              <template slot-scope="scope">
                <el-tag size="small" @click.native="handleEdit(scope.row)">查看详情</el-tag>
             </template>
            </el-table-column>

            <el-table-column
                prop="tbutton"
                label="查看所处建筑"
                width="120"
                align="center"
                v-if="hasPermission('site:edit')">
                <template slot-scope="scope">
                  <el-tag size="small" @click.native="editbuilding(scope.row)">查看建筑</el-tag>
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

           <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" ref="ruleForm" :rules="rules">
            <el-form-item label="站点名称" prop="site_name">
              <el-input v-model="formLabelAlign.site_name"></el-input>
            </el-form-item>

            <!-- 省市区三级联动下拉框 -->
            <el-form-item label="选择省市区">
              <el-cascader
                size="large"
                :options="options"
                v-model="formLabelAlign.selectedOptions">
              </el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" prop="address">
              <el-input v-model="formLabelAlign.address"></el-input>
            </el-form-item>
            <el-form-item label="百度经度" prop="longitude">
              <el-input v-model="formLabelAlign.longitude"></el-input>
            </el-form-item>
            <el-form-item label="百度纬度" prop="latitude">
              <el-input v-model="formLabelAlign.latitude"></el-input>
            </el-form-item>
          </el-form>

        </div>

       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="confirm">确 定</el-button>
         <el-button @click="dialogFormVisible = false" class="cancel">取 消</el-button>
       </div>
     </el-dialog>


     <el-dialog :title="this.building" :visible.sync="dialogdeVisible" width="720px" @close='closeDialog' :close-on-click-modal="false">
       <div class="building">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="150px" class="demo-dynamic" v-loading="loading">
            <el-form-item
              v-for="(domain, index) in dynamicValidateForm.buildingInfos"
              :label="'建筑物名称'"
              :key="domain.key"
              :prop="'buildingInfos.' + index + '.building_name'"
              :rules="[
                { required: true, message: '建筑物名称不能为空', trigger: 'blur'},
              ]"
              style="display:inlineblock">

              <el-input v-model="domain.building_name" style="width: 220px" placeholder="请输入建筑物名称"></el-input>

            <el-form-item :prop="'buildingInfos.' + index + '.id'" style="display:inline-block">
              <el-input v-model="domain.id" style="width: 150px" class="hidden"></el-input>
            </el-form-item>

              <el-button plain @click.prevent="editfloor(domain)" style="margin-left:10px">编辑楼层</el-button>
              <el-button class="cancel" plain @click.prevent="removeBuilding(domain)">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitBuilding('dynamicValidateForm')">提交</el-button>
              <el-button class="cancel large" plain @click="addBuilding">新增建筑物</el-button>
            </el-form-item>
          </el-form>
       </div>
    </el-dialog>


    <!-- 编辑建筑物楼层弹出框 -->
    <el-dialog :title="this.buildingflr" :visible.sync="buildingfloor" width="780px" @close='closefloor' :close-on-click-modal="false">
      <div class="building">
         <el-form :model="bulidfloor" ref="bulidfloor" label-width="100px" class="demo-dynamic" v-loading="floarloading">
           <el-form-item
             v-for="(domain, index) in bulidfloor.floorInfos"
             :label="'楼层'"
             :key="domain.key"
             :prop="'floorInfos.' + index + '.floor_name'"
             :rules="[
               { required: true, message: '楼层名不能为空', trigger: 'blur'},
             ]"
             style="display:inlineblock">

             <el-input v-model="domain.floor_name" style="width: 150px" placeholder="请输入楼层名称"></el-input>

           <el-form-item :prop="'floorInfos.' + index + '.person_name'" style="display:inline-block"
                         :rules="[{ required: true, message: '负责人名称不能为空', trigger: 'blur'}]">
             <el-input v-model="domain.person_name" style="width: 150px" placeholder="请输入负责人名称"></el-input>
           </el-form-item>

           <el-form-item :prop="'floorInfos.' + index + '.phone'" style="display:inline-block"
                         :rules="[{ required: true, message: '负责人手机号不能为空', trigger: 'blur'},{ pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}]">
             <el-input v-model="domain.phone" style="width: 150px" placeholder="负责人手机号"></el-input>
           </el-form-item>

             <el-button class="cancel" plain @click.prevent="removeFloor(domain)" style="height:40px">删除</el-button>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="submitFloor('bulidfloor')">提交</el-button>
             <el-button class="cancel large" plain @click="addFloor">新增楼层</el-button>
           </el-form-item>
         </el-form>
      </div>
   </el-dialog>


    </div>

</template>

<script>
import Qs from 'qs'
import { Message } from 'element-ui';
import { regionDataPlus,CodeToText } from 'element-china-area-data'


export default {
  data() {
      return {
        id: '',
        flag:'false',
        site_name:'',
        selectedOptions: [],
        delarr: [],
        siteoptions: [],
        building: '',
        buildingflr: '',
        building_id: '',
        site_id: '',
        // 列表中的数据
        tableData: [],

        dialogFormVisible: false,
        dialogdeVisible: false,
        buildingfloor: false,

        labelPosition: 'right',

        formLabelAlign: {
          site_name: '',
          province_name: '',
          province_id: '',
          city_name: '',
          city_id: '',
          area_name: '',
          area_id: '',
          address: '',
          selectedOptions: [],
          longitude: '',
          latitude: ''
        },

        // 建筑物信息列表数据
        dynamicValidateForm: {
          buildingInfos: [{ }],
        },

        // 建筑物楼层列表数据
        bulidfloor: {
          floorInfos: [{ }],
        },

        rules: {
          longitude: [
            {
              required: true,
              message: '请输入经度',
              trigger: 'blur'
            }
          ],
          latitude: [
            {
              required: true,
              message: '请输入纬度',
              trigger: 'blur'
            }
          ],
        },

        // 省市区三级联动数据
        options: regionDataPlus,


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
        siteheight: 450,

        loading: true,
        floarloading: true,

      }
    },

  created(){
    this.setheight();
    this.getSiteList();
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
    getSiteList() {
      // 发送请求获取数据
      // 配置本地代理来实现跨域请求
      if(this.currentPage!=1){
        this.currentPage=this.nowPage;
      }else{
        this.currentPage=1;
      }

      this.$axios.post(process.env.API_HOST+'api/v1/siteInfoList',
        Qs.stringify({
          'id':this.site_name,
          'province_id':this.selectedOptions[0],
          'city_id':this.selectedOptions[1],
          'area_id':this.selectedOptions[2]
          }))
      .then(res => {
          this.getsiteinfolist();
          this.tableData=[];
          this.totalnum = res.data.siteList.length;
          this.totalsum = res.data.siteList;
          // 页面刷新加载10条数据
          for(var i=(this.currentPage-1)*this.pagesize;i<this.currentPage*this.pagesize;i++){
            var pumpobj={};
            if(res.data.siteList[i]){
              pumpobj=res.data.siteList[i];
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

      this.$axios.get(process.env.API_HOST+'api/v1/siteInfo?'+Qs.stringify({'id':row.id})
          )
      .then(res => {
          this.formLabelAlign = res.data.site;
          this.formLabelAlign.selectedOptions=[];
          this.formLabelAlign.selectedOptions.push(res.data.site.province_id);
          this.formLabelAlign.selectedOptions.push(res.data.site.city_id);
          this.formLabelAlign.selectedOptions.push(res.data.site.area_id);
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
      params.append('site_name', this.formLabelAlign.site_name);
      params.append('province_name',  CodeToText[this.formLabelAlign.selectedOptions[0]]=="全部"? " " :CodeToText[this.formLabelAlign.selectedOptions[0]]);
      params.append('province_id', this.formLabelAlign.selectedOptions[0]);
      params.append('city_name',  CodeToText[this.formLabelAlign.selectedOptions[1]]=="全部"? " " :CodeToText[this.formLabelAlign.selectedOptions[1]]);
      params.append('city_id', this.formLabelAlign.selectedOptions[1]);
      params.append('area_name', CodeToText[this.formLabelAlign.selectedOptions[2]]=="全部"? " " :CodeToText[this.formLabelAlign.selectedOptions[2]]);
      params.append('area_id', this.formLabelAlign.selectedOptions[2]);
      params.append('address', this.formLabelAlign.address);
      params.append('longitude', this.formLabelAlign.longitude);
      params.append('latitude', this.formLabelAlign.latitude);

      // 判断flag如果为true时增加表单信息
      if(this.flag==true){

        this.$refs.ruleForm.validate((valid) => {
            if (valid) {

              this.$axios.post(process.env.API_HOST+'api/v1/addsiteInfo',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getSiteList();
                  this.$message.success('添加站点成功');
              })
              .catch(error => {
                if(this.$route.path=="/login"){
                }else{
                  this.$message.error('添加站点失败');
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

              this.$axios.post(process.env.API_HOST+'api/v1/updatesiteInfo',
                params
                  )
              .then(res => {
                  this.dialogFormVisible = false;
                  this.nowPage=this.currentPage;
                  this.getSiteList();
                  this.$message.success('修改站点成功');
              })
              .catch(error => {
                if(this.$route.path=="/login"){
                }else{
                  this.$message.error('修改站点失败');
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
      this.delarr=this.delarr.toString();
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(process.env.API_HOST+'api/v1/deletesiteInfo?id='+this.delarr
              )
          .then(res => {
              if(res.data.status=="SUCCESS"){
                this.nowPage=this.currentPage;
                this.getSiteList();
                this.$message.success('删除成功');
              }else {
                this.$message.error(res.data.message);
              }
          })
          .catch(error => {
            if(this.$route.path=="/login"){
            }else{
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
    },

    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields();
      this.formLabelAlign.selectedOptions=[];
    },

    // 表格前面选择框值改变的方法
    handleSelectionChange(val) {
      this.delarr=[];
      for(var i=0;i<val.length;i++){
        this.delarr.push(val[i].id)
      }
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


    // 编辑建筑物信息
    editbuilding(row){
      this.dialogdeVisible = true;
      this.$axios.get(process.env.API_HOST+'api/v1/buildingInfo?'+Qs.stringify({'site_id':row.id})
          )
      .then(res => {
          this.building=res.data.site.site_name;
          this.dynamicValidateForm.buildingInfos = res.data.buildingInfo;
          this.loading=false;
      })
      .catch(error => {
      });
        return this.site_id = row.id;

    },

    // 提交建筑物表单
    submitBuilding(formName) {

      this.$refs[formName].validate((valid) => {
         if (valid) {
           this.$axios.post(process.env.API_HOST+'api/v1/addbuildingInfo',

           JSON.stringify(this.dynamicValidateForm.buildingInfos),
           // 把请求头设置为json形式
           {headers:{'Content-Type': 'application/json'}}
               )
           .then(res => {
               this.dialogdeVisible = false;
               this.$message.success('保存成功');
           })
           .catch(error => {
             if(this.$route.path=="/login"){
             }else{
               this.$message.error('请核实建筑物信息是否正确');
             }
           });
         } else {
           return false;
         }
       });

        },

    // 删除建筑物
    removeBuilding(item) {

      if(item.id){
        this.$axios.delete(process.env.API_HOST+'api/v1/deletebuildingInfo?'+Qs.stringify({'id':item.id})
            )
        .then(res => {
          if(res.data.status=="SUCCESS"){
            var index = this.dynamicValidateForm.buildingInfos.indexOf(item)
            if (index !== -1) {
              this.dynamicValidateForm.buildingInfos.splice(index, 1)
            }
          }else {
            this.$message.error('删除建筑物失败,该建筑物下有楼层，不能删除!');
          }
        })
        .catch(error => {
          if(this.$route.path=="/login"){
          }else{
            this.$message.error('删除建筑物失败');
          }
        });
      }else{
        var index = this.dynamicValidateForm.buildingInfos.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.buildingInfos.splice(index, 1)
        }
      }

    },
    // 增加建筑物
    addBuilding(item) {
      this.dynamicValidateForm.buildingInfos.push({
        site_name: '',
        building_name: '',
        key: Date.now(),
        site_id: this.site_id,
      });
    },

    // 清除建筑物表单
    closeDialog(){
      this.$refs.dynamicValidateForm.resetFields();
      this.loading=true;
    },


    // 编辑楼层信息
    editfloor(item){
      if(item.id){

        this.buildingfloor = true;
        this.$axios.get(process.env.API_HOST+'api/v1/floorInfo?'+Qs.stringify({'id':item.id})
            )
        .then(res => {
            this.buildingflr=res.data.buildingInfo.building_name;
            this.building_id=res.data.buildingInfo.id;
            this.bulidfloor.floorInfos = res.data.floorInfo;
            this.floarloading=false;
        })
        .catch(error => {
        });

      }else{
        this.$message.warning('请先提交当前建筑物信息后再编辑楼层');
      }





    },

    // 提交楼层表单
    submitFloor(formName) {

      this.$refs[formName].validate((valid) => {
         if (valid) {
           this.$axios.post(process.env.API_HOST+'api/v1/addfloorInfo',

           JSON.stringify(this.bulidfloor.floorInfos),
           // 把请求头设置为json形式
           {headers:{'Content-Type': 'application/json'}}
               )
           .then(res => {
               this.buildingfloor = false;
               this.$message.success('保存成功');
           })
           .catch(error => {
             if(this.$route.path=="/login"){
             }else {
               this.$message.error('请核实楼层信息是否正确');
             }
           });
         } else {
           return false;
         }
       });

        },

    // 删除楼层
    removeFloor(item) {
      if(item.id){
        this.$axios.delete(process.env.API_HOST+'api/v1/deletefloorInfo?'+Qs.stringify({'id':item.id})
            )
        .then(res => {

          var index = this.bulidfloor.floorInfos.indexOf(item)
          if (index !== -1) {
            this.bulidfloor.floorInfos.splice(index, 1)
          }

        })
        .catch(error => {
          if(this.$route.path=="/login"){
          }else{
            this.$message.error('删除楼层失败');
          }
        });
      }else{
        var index = this.bulidfloor.floorInfos.indexOf(item)
        if (index !== -1) {
          this.bulidfloor.floorInfos.splice(index, 1)
        }
      }
    },
    // 增加楼层
    addFloor(item) {
      this.bulidfloor.floorInfos.push({
        building_name: '',
        building_id: this.building_id,
        floor_name: '',
        person_name: '',
        phone: '',
        key: Date.now(),
      });
    },

    // 清除楼层表单信息
    closefloor(){
      this.$refs.bulidfloor.resetFields();
      this.floarloading=true;
    },

    // 设置高度
    setheight(){
      var w = screen.availHeight;
      this.siteheight = w-374;
    }

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
      height: 310px;
      overflow: auto;
      padding: 0 100px 0 50px;
      .el-button{
        display: inline-block;
      }
      .el-select{
        width: 330px;
      }
      .el-cascader{
        width: 330px;
      }
    }
    .building{
      height: 400px;
      overflow: auto;
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
    .large{
      width: 110px;
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
      margin-right: 12px;
    }
    p{
      display: inline-block;
      color: #565656;
      margin-right: 5px;
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
  .site{
    .term{
      display: none;
    }
  }
  @media screen and (max-width:1455px){
    .query{
      .site{
        p{
          display: none;
        }
        .term{
          display: inline-block;
          margin-right: 10px;
        }
      }
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

</style>
