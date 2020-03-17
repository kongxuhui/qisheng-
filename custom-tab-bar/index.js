Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#0D7871",
    list: [
      {
        selectedIconPath: "/assets/images/homepage_index_pressed-@3x.png",
        iconPath: "/assets/images/homepage_index_normal-@3x.png",
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "/assets/images/alarm_index_pressed-@2x.png",
        iconPath: "/assets/images/alarm_index_normal-@2x.png",
        pagePath: "/pages/dianliang/dianliang",
        text: "报警"
      },
      {
        selectedIconPath: "/assets/images/me_index_pressed@2x.png",
        iconPath: "/assets/images/me_index_normal@2x.png",
        pagePath: "/pages/personCenter/personCenter",
        text: "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})