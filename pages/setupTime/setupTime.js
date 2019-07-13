const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    time1: "00:00",
    time2: "00:00",
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  bindTimeChange: function(ev){
    let type = ev.currentTarget.dataset.type;
    let value = ev.detail.value;
    this.setData({
      [type]: value
    });
  },
  clickAppoint: function () {
    let userId = wx.getStorageSync("userId");
    let time1 = this.data.time1;
    let time2 = this.data.time2;
    let dataUrl = app.globalData.baseUrl + "user/sethavetime";
    let reqData = {
      user_id: userId,
      havetime: time1 + "-" + time2
    }
    console.log(JSON.stringify(reqData));
    util.httpRequest(dataUrl, 'post', this.submitFn, reqData);
    
  },
  submitFn: function(res){
    let url = "../userRecommendation/userRecommendation";
    wx.showToast({
      title: "设置成功",
      icon: 'none',
      success: function () {
        setTimeout(function () {
          wx.switchTab({
            url: url
          })
        }, 1000);
      }
    });
  }
});