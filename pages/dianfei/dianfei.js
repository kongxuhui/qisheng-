import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
var Chart = null;
var Chart1 = null;

var xdata = [];
var xdata2 = [];

var ydata1 = [];
var ydata2 = [];

Page({
  data: {
    ec1: {
      lazyLoad: true
    },
    ec2: {
      lazyLoad: true
    },
  },
  onLoad() {
    if (!app.globalData.userInfo) {
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
    } else if (app.globalData.userInfo.state == 1) {
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
    } else if (app.globalData.userInfo.state == 2) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户待审核，请等待',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../personCenter/personCenter',
            })
          }
        }
      })
    } else if (app.globalData.userInfo.state == 4) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户审核不通过，请重新完善资料',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../personCenter/personCenter',
            })
          }
        }
      })
    } else {
      this.echartsComponnet1 = this.selectComponent('#mychart-dom-multi-bar');
      this.echartsComponnet2 = this.selectComponent('#mychart-dom-line');
      app.wxRequest('qisheng/Ptprograme/today_count.html', 'post', {}, this.getData2, this.error)
      app.wxRequest('qisheng/Companyanalysis/compare_data.html', 'post', { area_buy_user_data_type: 2 }, this.getData3, this.error)
    }
  },
  onReady() {
  },
  getData2: function (data) {
    xdata2 = [];
    ydata2 = [];
    data.data.obj.power_count_lst.forEach((item) => {
      xdata2.push(item.forecast_date.substr(item.forecast_date.length - 8))
      ydata2.push(item.sumpower)
    })
    this.getData1()
  },
  getData3: function (data) {
    xdata = [];
    ydata1 = [];
    data.data.obj.forEach((item) => {
      xdata.push(item.datat.substring(0, 10))
      ydata1.push(item.forecast_electricity)
    })
    this.getData()
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
    this.echartsComponnet2.init((canvas, width, height) => {
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
    Chart.setOption(this.getOption(xdata, ydata1));  //获取新数据
  },
  getOption: function (xdata, ydata1) {
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '日用电预测走势图',
        textStyle: {
          //字体大小
          fontSize: 12
        },
        x: 'center',
        y: 'bottom',
      },
      color: ["#1998dc", "#000"],
      legend: {
        data: ['预测电量'],
        top: 22,
        left: 'center',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdata,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: '预测电量',
        type: 'line',
        smooth: true,
        data: ydata1
      }]
    };
    return option;
  },
  getData1: function () {
    //如果是第一次绘制
    // if (!Chart) {
    this.init_echarts1(); //初始化图表
    // } else {
    //   this.setOption(Chart); //更新数据
    // }
  },
  init_echarts1: function () {
    this.echartsComponnet1.init((canvas, width, height) => {
      // 初始化图表
      Chart1 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption1(Chart1);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart1;
    });
  },
  setOption1: function (Chart1) {
    Chart1.clear();  // 清除
    Chart1.setOption(this.getOption1(xdata2, ydata2));  //获取新数据
  },
  getOption1: function ( xdata2, ydata2) {
    // 指定图表的配置项和数据
    var option = {
      color: ['#37a2da',],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      title: {
        text: '当月15分钟用电量',
        textStyle: {
          //字体大小
          fontSize: 12
        },
        x: 'center',
        y: 'bottom',
      },
      // legend: {
      //   data: ['热度',]
      // },
      grid: {
        left: 20,
        right: 20,
        bottom: 45,
        top: 40,
        containLabel: true
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: xdata2,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      series: [
        {
          name: '用电量',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true
            }
          },
          data: ydata2
        }
      ]
    };
    return option;
  },
});