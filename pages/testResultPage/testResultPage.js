const app = getApp();

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  goPage: function (ev) {
    wx.switchTab({
      url: "../userRecommendation/userRecommendation"
    })
  }
});