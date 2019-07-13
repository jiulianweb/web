const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    meetBaList: [],
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.setData({
      meetBaList: []
    });
    this.getMeetBa();
  },
  /*下拉刷新*/
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.setData({
      meetBaList: []
    });
    this.getMeetBa();
  },
  getMeetBa: function (){
    let dataUrl = app.globalData.baseUrl + "loveba/getlist"
    util.httpRequest(dataUrl, "get", this.getMeetBaFn);
  },
  getMeetBaFn: function(res){
    if(res.msg){
      for (let i = 0; i < res.msg.length; i++){
        if (!res.msg[i].pics){
          res.msg[i].pics = [];
        }else{
          res.msg[i].pics = res.msg[i].pics.split(",");
        }
      }
      this.setData({
        meetBaList: res.msg
      })
    }
  },
  goPage: function (ev) {
    let dataset = ev.currentTarget.dataset;
    let id = ev.currentTarget.dataset.id;
    let url = dataset.url + "?id=" + id;
    app.hrefToPageFn(url);
  }
});