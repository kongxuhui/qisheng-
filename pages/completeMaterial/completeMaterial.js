// pages/personalInfo/personalInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    id:'',
  },
  formSubmit: function (e) {
    var _this = this
    var postData = {
      true_name: e.detail.value.true_name,
      user_id: app.globalData.user_id,
      common: e.detail.value.beizhu,
    }
    app.wxRequest('qisheng/User/add_or_save.html', 'post', postData, _this.addPerson, _this.error)
  },
  addPerson: function(data){
    app.globalData.userInfo = data.data.obj
    wx.setStorage({
      key: "userInfo",
      data: data.data.obj
    })
    wx.switchTab({
      url: '../personCenter/personCenter',
    })
  },
  getData: function (data) {
    this.setData({
      loadingShow: false
    })
    let _this = this;
    if (data.data.code === '000000') {
      wx.setStorage({
        key: "userInfo",
        data: data.data.user
      })
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500,
        success: function () {
          setTimeout(function () {
            wx.hideLoading({
              success: function () {
                wx.switchTab({
                  url: '../personCenter/personCenter'
                })
              }
            })
          }, 1500)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})