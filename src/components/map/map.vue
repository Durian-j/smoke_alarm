<template lang="html">
  <div class="smokemap" id="smokemap">
    <div class="warn">
      <div class="inform" id="info">

        <!-- <el-select v-model="value" placeholder="点击选择站点" @change="handleChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->

        <div class="">
          <i class="iconfont icon-weibiaoti2"></i>
          <span>报警站点:</span>
          <span>{{warnarea}}</span>
        </div>

        <!-- <div id="r-result">
      		经度: <input id="longitude" type="text" v-model="longitude" style="width:100px; margin-right:10px;" />
      		纬度: <input id="latitude" type="text" v-model="latitude" style="width:100px; margin-right:10px;" />
      		<input type="button" value="查询" @click="initBaiduMap()" />
      	</div> -->

      </div>
    </div>

    <div class="mask">
    </div>

    <div id="baiduMap"></div>

  </div>

</template>

<script>
export default {

  data () {
    return {
      longitude: "",
      latitude: "",
      warnarea:"",
      options: [],
      value: '',
      data:[],
    }
  },
  created(){
    this.getsitemap();
  },
  mounted() {
    this.setheight();
  },
  methods: {
    initBaiduMap() {
      let script = document.createElement("script")
      script.src = "http://api.map.baidu.com/api?v=2.0&1VFRmTGRmM3aGrjuYPf42FoZ99Iv2gsM&callback=createMap"
      document.head.appendChild(script)
      window.createMap = () => {

      	var map = new BMap.Map("baiduMap",{enableMapClick:false});

        if(this.data.length>0){

          for(let i=0;i<this.data.length;i++){
            if(this.data[i][6]>0){
              map.centerAndZoom(new BMap.Point(this.data[i][3],this.data[i][4]), 40);
              break;
            }else{
              map.centerAndZoom(new BMap.Point(this.data[1][3],this.data[1][4]), 40);
            }
          }
        }else{
          map.centerAndZoom(new BMap.Point(118.77807441,32.0572355), 40);
        }


        var myIcon = new BMap.Icon("http://map.baidu.com/image/us_mk_icon.png", new BMap.Size(24.5,25),{
          offset: new BMap.Size(100, 250),
          // 当需要从一幅较大的图片中截取某部分作为标注图标时，需要指定大图的偏移位置
          imageOffset: new BMap.Size(2, -20.5) // 设置图片偏移,绿色的点
          // imageOffset: new BMap.Size(-22, -21.5) // 设置图片偏移，蓝色的点
        });

        var data_info = this.data;

      	for(var i=0;i<data_info.length;i++){
          if(data_info[i][6]==0){
            var marker = new BMap.Marker(new BMap.Point(data_info[i][3],data_info[i][4]),{icon:myIcon});  // 创建标注
            var sContent  =
          	"<div style='width: 325px;background-color: #ffffff;border-radius: 2px;border: solid 2px #ff5402'>" +
          	"<div style='width: 310px;height: 38px;background-color: #ff5402;font-size: 16px;color: #ffffff;line-height: 38px;padding-left:15px'>信息说明<i style='display:block;width:19px;height:19px;position:absolute;top:2px;left:301px' class='iconfont icon-2guanbi'></i></div>" +
          	"<div style='font-size: 18px;line-height: 38px;color: #252525;padding:10px 10px'>" + data_info[i][1] +": "+ data_info[i][2] +
          	"<div style='width: 281px;height: 103px;background-color: #eaecee;border: solid 1px #d6dbe4;margin-top:10px;font-size: 15px;line-height: 35px;color: #575555;padding:10px;'>"+
            "<p>烟感数量："+ data_info[i][5] +"</p>"+
            "<p>报警数量："+ data_info[i][6] +"</p>"+
            "<a href='/#/main/device?id="+data_info[i][0]+"' style='color:#ff5402;text-decoration:none;'>点击此处查看详情</a>"+
            "</div>"+
            "</div>"+
            "</div>"

        		map.addOverlay(marker);               // 将标注添加到地图中
        		addClickHandler(sContent,marker);
          }else{
            var marke = new BMap.Marker(new BMap.Point(data_info[i][3],data_info[i][4]));  // 创建标注
            var sContent  =
          	"<div style='width: 325px;background-color: #ffffff;border-radius: 2px;border: solid 2px #ff5402'>" +
          	"<div style='width: 310px;height: 38px;background-color: #ff5402;font-size: 16px;color: #ffffff;line-height: 38px;padding-left:15px'>信息说明<i style='display:block;width:19px;height:19px;position:absolute;top:2px;left:301px' class='iconfont icon-2guanbi'></i></div>" +
          	"<div style='font-size: 18px;line-height: 38px;color: #252525;padding:10px 10px'>" + data_info[i][1] +": "+ data_info[i][2] +
          	"<div style='width: 281px;height: 103px;background-color: #eaecee;border: solid 1px #d6dbe4;margin-top:10px;font-size: 15px;line-height: 35px;color: #575555;padding:10px;'>"+
            "<p>烟感数量："+ data_info[i][5] +"</p>"+
            "<p>报警数量："+ data_info[i][6] +"</p>"+
            "<a href='/#/main/device?id="+data_info[i][0]+"' style='color:#ff5402;text-decoration:none;'>点击此处查看详情</a>"+
            "</div>"+
            "</div>"+
            "</div>"

            map.addOverlay(marke);               // 将标注添加到地图中
            addClickHandler(sContent,marke);
            marke.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
          }

      	}


      	function addClickHandler(sContent,marker){
      		marker.addEventListener("click",function(e){
      			openInfo(sContent,e)}
      		);
      	}

      	function openInfo(sContent,e){
      		var p = e.target;
      		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);

          var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象

      		map.openInfoWindow(infoWindow,point); //开启信息窗口
      	};

        // 用经纬度设置地图中心点
    		// if(document.getElementById("longitude").value != "" && document.getElementById("latitude").value != ""){
    		// 	var new_point = new BMap.Point(document.getElementById("longitude").value,document.getElementById("latitude").value);
        //   map.panTo(new_point);
        //
        // }

        map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]})); //添加地图类型控件
        map.addControl(new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT
        }));
        map.addControl(new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
        }));
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        map.enableInertialDragging(); //两秒后开启惯性拖拽
      }
    },

    handleChange(value) {
      let obj = {};
      obj = this.options.find((item)=>{
          return item.value === value;
      });
      this.warnarea=obj.label;
      var data = value.split(",");
      this.longitude=data[0];
      this.latitude=data[1];
    },

    // 获取所有站点信息
    getsitemap(){
      this.$axios.get(process.env.API_HOST+'api/v1/siteInfoMap'
          )
      .then(res => {
          this.data=res.data.siteMap;
          this.initBaiduMap();
          this.options=[];
          for(var i=0;i<this.data.length;i++){
            if(this.data[i][6]!=0){
              // var obj={};
              // obj.value=this.data[i][3]+','+this.data[i][4];
              // obj.label=this.data[i][1]+': '+this.data[i][2];
              // this.options.push(obj)
              this.warnarea+=this.data[i][1]+': '+this.data[i][2]+'; ';
            }
          }
      })
      .catch(error => {
        if(this.$route.path=="/login"){
        }else{
          this.$message.error('获取站点信息失败');
        }
      });
    },

    // 设置高度
    setheight(){
      var w = screen.availHeight;
      document.getElementById("baiduMap").style.height = (w-238)+"px"
    }

  },
}
</script>

<style lang="scss" scoped>
  .warn{
    height: 26px;
    background-color: #fff3e4;
    border: 1px solid #ffdeb4;
    padding: 11px 15px;
    margin: 10px 0px;
    border-radius: 2px;
    overflow: hidden;
    i{
      font-size: 20px;
      color: #e84545;
    }
    span{
      font-size: 16px;
      letter-spacing: 2px;
      color: #333333;;
    }
    .inform{
      width: 3750px;
      height: 20px;
      // overflow: hidden;
      animation: move 20s linear infinite;
      div{
        float: left;
        margin-right: 74px;
      }
    }
  }



  #baiduMap{
    height: 590px;
    margin-top: 10px;

  }
</style>
<style lang="scss">
  .BMap_top{
    display: none;
  }
  .BMap_center{
    display: none;
  }
  .BMap_bottom{
    display: none;
  }
  .BMap_top+div,.BMap_center+div,.BMap_bottom+div{
    display: none;
  }
  .BMap_pop>div:first-child{
    display: none;
  }
  .BMap_pop>div:nth-child(8){
    display: none;
  }
  .BMap_pop img{
    top: 32px !important;
    left: 320px !important;
    opacity: 0;
  }
  .warn .el-select .el-input{
    position: absolute;
    width: 200px;
    left: 200px;
    opacity: 0;
    .el-input__inner{
      height: 30px;
    }

  }

</style>
