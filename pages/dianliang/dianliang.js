// pages/batchCar/batchCar.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingShow: false,
    trainApprovalList: [],
    hasMore: false,
    finish: false,
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          } else if (res.cancel) {
            _this.onShow();
          }
        }
      })
    } else if (app.globalData.userInfo.state == '1') {
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
    } else if (app.globalData.userInfo.state == '2') {
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
    } else if (app.globalData.userInfo.state == '4') {
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
      app.wxRequest('qisheng/Ptprograme/alarm_lst.html', 'post', {page: this.data.pageNum}, this.getList, this.error)
    }
  },
  getList: function(data){
    if(!this.data.hasMore){
      this.setData({
        trainApprovalList: data.data.obj
      });
    }else{
      console.log(data.data.obj)
      if(data.data.obj.length != 0){
        this.setData({
          hasMore: false,
          trainApprovalList: this.data.trainApprovalList.concat(data.data.obj)
        });
      }else{
        this.setData({
          hasMore: false,
          finish: true
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 //这个数是，tabBar从左到右的下标，从0开始
      })
    }
  },
  loadMoreData: function(){
    var that = this;
    that.setData({
      hasMore: true
    });
    app.wxRequest('qisheng/Ptprograme/alarm_lst.html', 'post', {page: that.data.pageNum +=1}, that.getList, that.error)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that =this;
    that.loadMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})