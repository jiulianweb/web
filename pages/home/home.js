const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    status: false,
    reqData: {
      gender: 2,
      nickname: "",
      birthday: "2019-05-20",
      height: "",
      school: "",
      major: "",
    },
    isSelectGirl: true,
    EToC: {
      nickname: "昵称",
      birthday: "生日",
      height: "身高",
      school: "学校",
      major: "专业",
      gender: "性别"
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  bindKeyInput(ev) {
    let key = ev.currentTarget.dataset.key;
    let value = ev.detail.value;
    let reqData = this.data.reqData;
    reqData[key] = value;
    this.setData({
      reqData: reqData
    });
  },
  selectGender(ev) {
    let sex = ev.currentTarget.dataset.sex;
    let reqData = this.data.reqData;
    reqData.gender = Number(sex);
    this.setData({
      isSelectGirl: sex == 2 ? true : false,
      reqData: reqData
    })
  },
  nextStpe: function () {
    let userId = wx.getStorageSync("userId");
    let subObject = this.data.reqData;
    for(let item in this.data.reqData){
      if(this.data.reqData[item] === "" || this.data.reqData[item] === null){
        wx.showToast({
          title: this.data.EToC[item] + '不能为空！',
          icon: 'none',
          mask: true,
          duration: 1500
        });
        return;
      }
    }
    subObject["user_id"] = userId;
    this.setData({
      reqData: subObject,
      status: true
    });
  },
  clickAgree: function () {
    let dataUrl = app.globalData.baseUrl + "user/userregister";
    let reqObject = this.data.reqData;
    console.log(JSON.stringify(reqObject));
    util.httpRequest(dataUrl, "post", this.saveMsgFn, reqObject);
  },
  saveMsgFn: function(res) {
    let url = "../uploadStudentCard/uploadStudentCard";
    wx.showToast({
      title: res.msg,
      icon: 'none',
      success: function(){
        setTimeout(function(){
          wx.redirectTo({
            url: url
          })
        },1000);
      }
    });
  },
  clickCancel: function () {
    this.setData({
      status: false
    });
  }
});