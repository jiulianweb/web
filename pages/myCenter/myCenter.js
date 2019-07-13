const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    userInfo: null,
    indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 500
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    let userId = wx.getStorageSync("userId");
    let baseUrl = app.globalData.baseUrl + "user/getuseinfoall/user_id/" + userId + "/";
    util.httpRequest(baseUrl, "get", this.getUserInfo);
  },
  getUserInfo: function(res){
    if(res.data){
      if (res.data.imgs){
        res.data.imgs = res.data.imgs.split(",");
      }
      this.setData({
        userInfo: res.data
      });
    }
  },
  uploadImg(ev) {
    let userId = wx.getStorageSync("userId");
    let baseImgUrl = app.globalData.baseImgUrl + "common/upload";
    util.uploadImg(baseImgUrl, this.showImg, userId);
  },
  showImg: function (res) {
    let that = this;
    let userInfo = this.data.userInfo;
    let userId = wx.getStorageSync("userId");
    let baseImgUrl = "https://api.jiulove.cn";
    if (res && typeof res === "string") {
      res = JSON.parse(res)
    }
    userInfo["headimgurl"] = baseImgUrl + res.data.url;
    wx.request({
      url: app.globalData.baseUrl + "user/setmyinfo",
      data: JSON.stringify({ headimgurl: userInfo["headimgurl"], user_id: userId}),
      method: "post",
      dataType: "json",
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token') || ""
      },
      success: function (res) {
        setTimeout(function(){
          that.setData({
            userInfo: userInfo
          })
        },1000);
      }
    })
  },
  goPage: function (ev) {
    let dataset = ev.currentTarget.dataset;
    let url = dataset.url;
    app.hrefToPageFn(url);
  }
});