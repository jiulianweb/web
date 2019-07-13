const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    status: false,
    imgSign: "",
    student_id_f: "../../images/IDCardPositive.png",
    student_id_b: "../../images/IDCardBack.png",
    reqData: {
      name: "",
      idnumber: "",
      student_id_f: "",
      student_id_b: "",
      mobile: ""
    },
    EToC: {
      name: "真实姓名",
      idnumber: "身份证号码",
      student_id_f: "学生卡正面",
      student_id_b: "学生卡背面",
      mobile: "手机号码"
    }
  },
  onLoad: function (options) {
    
  },
  onShow: function () {

  },
  uploadSC(ev) {
    let userId = wx.getStorageSync("userId");
    let imgSign = ev.currentTarget.dataset.key;
    let baseImgUrl = app.globalData.baseImgUrl + "common/upload";
    this.setData({
      imgSign: imgSign
    });
    util.uploadImg(baseImgUrl, this.showImg, userId);
  },
  showImg(res) {
    let baseImgUrl = "https://api.jiulove.cn";
    let imgSign = this.data.imgSign;
    let reqData = this.data.reqData;
    if (res && typeof res === "string"){
      res = JSON.parse(res)
    }
    reqData[imgSign] = baseImgUrl + res.data.url;
    this.setData({
      [imgSign]: baseImgUrl + res.data.url,
      reqData: reqData
    })
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
  clickNext: function (ev) {
    let userId = wx.getStorageSync("userId");
    let dataUrl = app.globalData.baseUrl + "user/userinfoup";
    let reqObject = this.data.reqData;
    let telExp = /^1[34578]\d{9}$/;
    for (let item in this.data.reqData) {
      if (reqObject[item] === "" || reqObject[item] === null) {
        wx.showToast({
          title: this.data.EToC[item] + '不能为空！',
          icon: 'none',
          mask: true,
          duration: 1500
        });
        return;
      }
    }
    if (reqObject["idnumber"].length < 18) {
      tips.tipsFn("身份证号码有误");
      return;
    }
    if (!telExp.test(reqObject["mobile"])){
      tips.tipsFn("手机号码有误");
      return;
    }
    reqObject["user_id"] = userId;
    console.log(JSON.stringify(reqObject))
    util.httpRequest(dataUrl, "post", this.userInfoupFn, reqObject);
  },
  userInfoupFn: function(res){
    let url = "../addInfo/addInfo";
    wx.showToast({
      title: res.msg,
      icon: 'none',
      success: function () {
        setTimeout(function () {
          wx.redirectTo({
            url: url
          })
        }, 1000);
      }
    });
  }
});