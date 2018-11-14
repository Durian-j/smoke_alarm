
<!-- 检测单位信息设置 -->
<template lang="html">
    <div class="table census">
      <div class="mask">
      </div>

      <!-- 顶部查询条件 -->
      <div class="topquery">
        <div class="select">
          <div class="sitename">
            <span>查询条件:</span>
            <p>站点名称</p>
            <el-select v-model="siteId" placeholder="请选择站点" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="smokenum">
            <p>烟感编号</p>
            <el-input
              placeholder="请输入烟感编号"
              v-model="number"
              clearable>
            </el-input>
          </div>

          <div class="block timel">
            <p>时间选择</p>
            <el-date-picker
              v-model="startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间"
              align="center"
              :picker-options="pickerOptions"
              @change="logTimeChange">
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间"
              align="center"
              :picker-options="pickerOptions"
              @change="logTimeChange">
            </el-date-picker>
          </div>

          <el-button @click="getSiteList">查 询</el-button>
        </div>
      </div>
      <!-- 中间间隔栏 -->
      <div class="interval">
      </div>

      <!-- 底部详细表格 -->
      <div class="detailtab">
        <div class="census">
          <el-table
            ref="multipleTable"
            stripe
            :data="tableData"
            tooltip-effect="dark"
            :height="censusheight"
            style="width: 100%"
            v-loading="loading">
            <el-table-column
              type="selection"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column
              label="烟感编号"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.number }}</template>
            </el-table-column>
            <el-table-column
              prop="serial_number"
              label="产品序列号"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="eventTime"
              label="报警时间"
              width="185"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="person_name"
              label="联系人"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="site_name"
              label="站点"
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="alarmStatus"
              label="烟感状态"
              sortable
              align="center"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="batteryStatus"
              label="电池状态"
              sortable
              align="center"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>


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
    </div>

</template>

<script>
import Qs from 'qs'
import { Message } from 'element-ui';


export default {
  data() {
      return {
        id: '',
        flag:'false',
        // 列表中的数据
        tableData: [],

        options: [],
        siteId: '',
        number: '',
        censusheight: 450,
        loading: false,


        // 时间选择器数据
          pickerOptions: {
            // 使时间选择器选择今天以前的值
            disabledDate(time) {
              return time.getTime() > Date.now()
            },
          //带快捷选项
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },{
            text: '一个月前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          }]
        },
        // 时间选择器文本框内的值
        startTime: '',
        endTime: '',

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

      }
    },

  created(){
    this.getsiteinfolist();
    this.setheight();
  },

  methods: {

    // 页数切换时的回调函数
    handleCurrentChange(val) {
      this.loading=true;
      this.tableData=[];
      // 每次切换页面先把数组清空
      if((this.startTime==''||this.startTime==null)||(this.endTime==''||this.endTime==null)){
        this.$message.warning('请选择开始时间和结束时间');
      }else{
        this.$axios.get(process.env.API_HOST+'api/v1/collectiontotal?'
        +Qs.stringify({
          'site_id':this.siteId,
          'number':this.number,
          'startTime':this.startTime,
          'endTime':this.endTime,
          'pageNum':val
          })
            )
        .then(res => {
          this.tableData=res.data.dataInfos;
          this.totalnum=res.data.total;
          this.pagesize=res.data.pagesize;

          for(var i=0;i<this.tableData.length;i++){
            if(this.tableData[i].alarmStatus==2){
              this.tableData[i].alarmStatus="报警"
            }else{
              this.tableData[i].alarmStatus="正常"
            }
            if(this.tableData[i].batteryStatus==0){
              this.tableData[i].batteryStatus="电量不足"
            }else{
              this.tableData[i].batteryStatus="正常"
            }
          }
          this.loading=false;
        })
        .catch(error => {
        });
      }

    },
    // 获取单位信息
    getSiteList() {
      this.loading=true;
      if((this.startTime==''||this.startTime==null)||(this.endTime==''||this.endTime==null)){
        this.$message.warning('请选择开始时间和结束时间');
      }else{
        // 发送请求获取数据
        this.$axios.get(process.env.API_HOST+'api/v1/collectiontotal?'
        +Qs.stringify({
          'site_id':this.siteId,
          'number':this.number,
          'startTime':this.startTime,
          'endTime':this.endTime,
          })
            )
        .then(res => {
          if(res.data.total==0){
            this.$message.warning('该时间段没有数据');
          }else{
            this.tableData=res.data.dataInfos;
            this.totalnum=res.data.total;
            this.pagesize=res.data.pagesize;
            for(var i=0;i<this.tableData.length;i++){
              if(this.tableData[i].alarmStatus==2){
                this.tableData[i].alarmStatus="报警"
              }else{
                this.tableData[i].alarmStatus="正常"
              }
              if(this.tableData[i].batteryStatus==0){
                this.tableData[i].batteryStatus="电量不足"
              }else{
                this.tableData[i].batteryStatus="正常"
              }
            }
            this.loading=false;
          }
        })
        .catch(error => {
        });
      }

    },


    // 取得时间选择器的值
    logTimeChange(val) {
      if(this.startTime&&this.endTime){
        if(Date.parse(new Date(this.endTime))-Date.parse(new Date(this.startTime))>7776000000){
          this.$message.warning('查询时间间隔为3个月');
        }
      }
    },

    // 获取站点下拉框
    getsiteinfolist(){
      this.options=[];
      this.$axios.post(process.env.API_HOST+'api/v1/siteInfoList')
      .then(res => {
          for(let i=0;i<res.data.siteList.length;i++){
            let obj={};
            obj.value=res.data.siteList[i].id;
            obj.label=res.data.siteList[i].site_name;
            this.options.push(obj)
          }
      })
      .catch(error => {
      });
    },

    // 设置高度
    setheight(){
      var w = screen.availHeight;
      this.censusheight = w-374;
    }
  },
}

</script>

<style lang="scss" scoped>
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
	    background-color: #4ea5ef;
	    border-radius: 1px;
      font-size: 14px;
      color: #ffffff;
      padding: 0px;
      border: 0px;
      padding-top: 3px;
      margin-left: 15px;
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
      th{
        font-size: 18px;
      }
    }
  }

  .el-tag{
    padding: 0 5px;
    cursor: pointer;
    display: inline-block;
  }


  .el-dialog{

    .formtab{
      height: 200px;
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
      .el-option{
        width: 200px;
      }
    }

    .dialog-footer{
      .el-button{
        padding: 12px 20px;
        border: 1px solid #ccc;
      }
    }

  }
  .el-form-item__content{
    .el-button{
      padding: 12px 20px;
      border: 1px solid #ccc;
    }
  }
  .select{
    div{
      display: inline-block;
    }
    .sitename{
      margin-right: 15px;
    }
    .smokenum{
      margin-right: 15px;
    }
    p{
      display: inline-block;
      color: #565656;
      margin-right: 6px;
      font-size: 14px;
    }
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 195px;
  }
  .smokenum{
    .el-input{
      width: 200px;
    }
  }
  .sitename{
    span{
      display: none;
    }
  }

  @media screen and (max-width:1455px){
    .select{
        p{
          display: none;
        }
    }
    .sitename{
      span{
        display: inline-block;
        margin-right: 10px;
      }
    }
  }

</style>
<style lang="scss">
  .census{
    .has-gutter>tr>th{
      padding: 7px 0;
    }
  }

  .el-table thead{
    color: inherit;
  }
  .sitename{
    .el-input__inner{
      width: 200px;
    }
  }
  .el-input__icon{
    line-height: 3px;
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
  .census{
    .el-loading-mask{
      top: 48px;
    }
  }

</style>
