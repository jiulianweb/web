const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    isInvitation: true,
    status: false,
    matchingModel: false,
    invitationBox: false,
    choiceModel: false,
    imgUrls: [],
    vertical: false,
    circular: false,
    interval: 2000,
    duration: 1000,
    userInfo: {},
    tags: []
  },
  onLoad: function (options) {
    console.log(options);
    let baseUrl = app.globalData.baseUrl + "user/getuseinfoall/user_id/" + options.userId + "/";
    util.httpRequest(baseUrl, "get", this.getUserInfo);
  },
  getUserInfo: function (res) {
    console.log(res);
    if (res.data) {
      if (res.data.imgs) {
        res.data.imgs = res.data.imgs.split(",");
      }
      if (res.data.imgs) {
        res.data.tags = res.data.tags.split(";");
      }
      let tags = res.data.tags;
      console.log(tags);
      //["APP:抖音,王者荣耀", "喜欢的城市:罗马尼亚,北京", "你觉得你是什么样的人:霸道总裁,君临天下", "性格:外向,热情,快乐"]
      let tatArr = [];
      for (let i = 0; i < tags.length; i++) {
        let tagStr = tags[i].split(',');
        for (let j = 0; j < tagStr.length; j++) {
          if (j === 0) {
            tatArr.push(tagStr[j].split(':')[tagStr[j].split(':').length - 1])
          }
          else {
            tatArr.push(tagStr[j]);
          }
        }
        console.log(tatArr)
      }
      this.setData({
        imgUrls: res.data.imgs,
        userInfo: res.data,
        tags: tatArr
      });
    }
  },
  clickInvitation: function () {
    this.setData({
      status: true,
      invitationBox: true
    });
  },
  clickRemove: function () {
    this.setData({
      status: false,
      invitationBox: false
    });
  },
  configMathing: function (ev) {
    // this.setData({
    //   status: true,
    //   invitationBox: false,
    //   choiceModel: true
    // });
    let dataset = ev.currentTarget.dataset;
    let url = dataset.url;
    // app.hrefToPageFn(url,true);
    wx.switchTab({
      url: url
    })
  },
  closeChoiceModel: function () {
    this.setData({
      status: false,
      choiceModel: false
    });
  },
  configChoiceModel: function () {
    this.setData({
      status: false,
      invitationBox: false,
      choiceModel: false,
      isInvitation: false
    });
  },
  clickDeug: function () {
    this.setData({
      status: true,
      matchingModel: true
    });
  },
  closeMatchingModel: function () {
    this.setData({
      status: false,
      matchingModel: false
    });
  }
})