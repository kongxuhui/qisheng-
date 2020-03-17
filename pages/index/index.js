// var wxCharts = require('../../utils/wxcharts-min.js');
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

var Chart = null;

var xdata = [];
var ydata1 = [];
var ydata2 = [];

// var app = getApp();
// var lineChart = null;

Page({
  data: {
    selectData: [],
    index: 0,
    ec: {
      lazyLoad: true 
    },
    sjdl: '',
    qysl: '',
    sdsl: '',
    current_id: '',
    conmpany_name:''
  },
  onLoad: function (e) {
    var _this = this;
    if (app.globalData.checkLogin){
      if(app.globalData.open_id && app.globalData.userInfo){
        var postData = {
          open_id: app.globalData.open_id
        }
        if (app.globalData.userInfo.state == 1) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '用户已冻结，请联系管理员',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../login/login',
                })
              }
            }
          })
        } else if (app.globalData.userInfo.state == 2 || app.globalData.userInfo.state == 4) {
          app.wxRequest('qisheng/User/detail.html', 'post', postData, _this.getDetail, _this.error)
        } else {
          _this.echartsComponnet = _this.selectComponent('#mychart-dom-line');
          // _this.getData();
          app.wxRequest('qisheng/Company/lst.html', 'post', {}, _this.getData2, _this.error)
        }
      }
    }else{
      app.checkLoginReadyCallback = () => {
        if(app.globalData.open_id && app.globalData.userInfo){
          var postData = {
            open_id: app.globalData.open_id
          }
          if (app.globalData.userInfo.state == 1) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '用户已冻结，请联系管理员',
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../login/login',
                  })
                }
              }
            })
          } else if (app.globalData.userInfo.state == 2 || app.globalData.userInfo.state == 4) {
            app.wxRequest('qisheng/User/detail.html', 'post', postData, _this.getDetail, _this.error)
          } else {
            _this.echartsComponnet = _this.selectComponent('#mychart-dom-line');
            // _this.getData();
            app.wxRequest('qisheng/Company/lst.html', 'post', {}, _this.getData2, _this.error)
          }
        }
      };
    }
      
  },
  getDetail: function (data) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: app.globalData.userInfo.state == 2 ? '用户待审核，请等待' : '用户审核不通过，请重新完善资料',
      success(res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../personCenter/personCenter',
          })
        }
      }
    })
  },
  getData1: function(data){
    this.setData({ 
      sjdl: data.data.obj.use_sum,
      qysl: data.data.obj.company_count,
      sdsl: data.data.obj.buy_num
    });
    xdata = [];
    ydata1 = [];
    ydata2 = [];
    data.data.obj.buy_lst.forEach((item) => {
      xdata.push(item.buy_date.substring(0, 7))
      ydata1.push(item.buy_count)
      ydata2.push(item.use_count)
    })
    this.getData()
  },
  getData2: function (data) {
    var arr;
    for (var s in data.data.data) {
      arr = data.data.data.map(item => {
        return {
          name: item[Object.keys(item)[1]],
          id: item[Object.keys(item)[0]]
        }
      })
    }
    var obj = {}
    // var obj = { name: '请选择企业', value: '' }
    // arr.unshift(obj)
    this.setData({
      selectData: arr,
      current_id: arr[this.data.index].id,
    });
    app.wxRequest('qisheng/Ptprograme/home_page.html', 'post', {company_id: this.data.current_id}, this.getData1, this.error)
    this.onShow();
  },
  Change: function (e) {
    var _this = this
    _this.setData({
      index: e.detail.value,
      current_id: _this.data.selectData[e.detail.value].id,
      conmpany_name: _this.data.selectData[e.detail.value].name
    })
    app.wxRequest('qisheng/Ptprograme/home_page.html', 'post', {company_id: _this.data.current_id}, _this.getData1, _this.error)
  },
  getData: function () {
    //如果是第一次绘制
    // if (!Chart) {
      this.init_echarts(); //初始化图表
    // } else {
    //   this.setOption(Chart); //更新数据
    // }
  },
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption(xdata, ydata1, ydata2));  //获取新数据
  },
  getOption: function (xdata, ydata1, ydata2) {
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        show: true,
        backgroundColor: 'rgba(13,120,113,.5)',
        textStyle: {   // 提示框内容的样式
          color: '#fff',
          fontSize: 9
        },
        formatter: function(params) {
          const item0 = params[0];
          const item1 = params[1];
          var aa = xdata[item0.dataIndex]
          return `${aa} \n 购电量： ${item0.value}KWh\n用电量： ${item1.value}KWh`
        },
        position: function (point, params, dom, rect, size) {
          var x = 0; // x坐标位置
          var y = 28; // y坐标位置
          // 当前鼠标位置
          var pointX = point[0];
          var pointY = point[1];
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          if (boxWidth > pointX) {
            x = pointX + 20;
          } else {
            x = pointX - boxWidth - 20;
          }
          return [x, y];
        },
        trigger: 'axis'
      },
      title: {
        text: '近半年企业购电量和用电量对比',
        textStyle: {
          //字体大小
          fontSize: 12,
          color: '#0D7871'
        },
        x: -5,
        y: 0,
      },
      color: ["#0D7871", "#6CACA8"],
      legend: {
        top: '-2',
        right: '0',
        textStyle: {  // 图列内容样式
          color: '#0D7871',  // 字体颜色
        },
        data: ['购电量', '用电量']
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 20,
        top: 30,
        containLabel: true
      },
      yAxis: [
        {
          x: 'center',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: ['#fff']
            }
          },
          axisLine:{
            lineStyle:{
                color:'#fff',
                // width:8,//这里是为了突出显示加上的
            }
          },
          axisTick:{       //y轴刻度线
            show:false
          },
          axisLabel: {
              formatter: function(){
                    return "";
              }
          }
        }
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLabel: {    // 坐标轴标签
            color: 'rgba(13,120,113,0)'  // 默认取轴线的颜色 
          },
          boundaryGap: true,
          data: [1,2,3,4,5,6],
          // axisPointer: {
          //   snap: true,
          //   lineStyle: {
          //       color: '#0D7871',
          //       opacity: 1,
          //       width: 1
          //   },
          // },
          axisLine:{
            lineStyle:{
                color:'#fff',
                // width:8,//这里是为了突出显示加上的
            }
          },
        }
      ],
      series: [
        {
          name: '购电量',
          type: 'bar',
          barGap: 0,
          barWidth: 16,
          // stack: '总量',
          // data: [300, 270, 340, 344, 300, 320]
          data: ydata1
        },
        {
          name: '用电量',
          type: 'bar',
          barWidth: 16,
          // stack: '总量',
          // data: [200, 170, 240, 144, 200, 220]
          data: ydata2
        }
      ]
    };
    return option;
  },
  onShow: function(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0 //这个数是，tabBar从左到右的下标，从0开始
      })
    }
    if(app.globalData.open_id){
      var postData = {
        open_id: app.globalData.open_id
      }
      app.wxRequest('qisheng/User/detail.html', 'post', postData, (data) => {
        if(app.globalData.userInfo.state){
          if(data.data.obj == null){
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '用户暂未登录，请登录',
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../login/login',
                  })
                }
              }
            })
          }else if(data.data.obj.state != app.globalData.userInfo.state){
            app.globalData.userInfo = data.data.obj;
            wx.setStorage({
              key: "userInfo",
              data: data.data.obj
            })
          }
          // this.onLoad()
        }
      }, this.error)
    }
  }
});