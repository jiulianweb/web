const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    index: 0,
    imgArr: [
      "../../images/addImg.png",
      "../../images/addImg.png",
      "../../images/addImg.png"
    ],
    reqData: {
      name: "",
      nickname: "",
      height: "",
      hopeto: "",
      wantsay: "",
      aboutme: ""
    },
    EToC: {
      name: "真实姓名",
      nickname: "昵称",
      height: "身高",
      hopeto: "期望的他/她",
      wantsay: "感情观",
      aboutme: "关于我"
    }
  },
  onLoad: function (options) {
    let userId = wx.getStorageSync("userId");
    let baseUrl = app.globalData.baseUrl + "user/getuseinfoall/user_id/" + userId + "/";
    util.httpRequest(baseUrl, "get", this.getUserInfo);
  },
  onShow: function () {

  },
  getUserInfo: function (res) {
    let reqData = this.data.reqData;
    if (res.data) {
      if (res.data.imgs) {
        res.data.imgs = res.data.imgs.split(",");
      }
      for (let key in reqData){
        reqData[key] = res.data[key]
      }
      this.setData({
        imgArr: res.data.imgs,
        reqData: reqData
      });
    }
  },
  bindKeyInput(ev) {
    let type = ev.currentTarget.dataset.type;
    let value = ev.detail.value;
    let reqData = this.data.reqData;
    reqData[type] = value;
    this.setData({
      reqData: reqData
    });
  },
  uploadImg(ev) {
    let index = ev.currentTarget.dataset.index;
    let userId = wx.getStorageSync("userId");
    this.setData({
      index: index
    })
    let baseImgUrl = app.globalData.baseImgUrl + "common/upload";
    util.uploadImg(baseImgUrl, this.showImg, userId);
  },
  showImg: function(res){
    let index = this.data.index;
    let imgs = this.data.imgArr;
    let baseImgUrl = "https://api.jiulove.cn";
    if (res && typeof res === "string") {
      res = JSON.parse(res)
    }
    imgs[index] = baseImgUrl + res.data.url;
    this.setData({
      imgArr: imgs
    })
  },
  submit: function(){
    let userId = wx.getStorageSync("userId");
    let imgArr = this.data.imgArr;
    let reqData = this.data.reqData;
    let imgStr = "";
    let dataUrl = app.globalData.baseUrl + "user/setmyinfo";
    for (let i = 0; i < imgArr.length; i++){
      if (imgArr[i] == "../../images/addImg.png"){
        tips.tipsFn("请上传图片");
        return;
      }else {
        imgStr += imgArr[i] + ","
      }
    }
    for (let item in reqData) {
      if (reqData[item] === "" || reqData[item] === null) {
        wx.showToast({
          title: this.data.EToC[item] + '不能为空！',
          icon: 'none',
          mask: true,
          duration: 1500
        });
        return;
      }
    }
    reqData["imgs"] = imgStr.slice(0, imgStr.length-1);
    reqData["user_id"] = userId;
    console.log(JSON.stringify(reqData))
    util.httpRequest(dataUrl, "post", this.modifyUserInfo, reqData); 
  },
  modifyUserInfo: function(res){
    wx.showToast({
      title: res.msg,
      icon: 'none',
      duration: 2000,
      success: function () {
        wx.navigateBack({
          delta: 2
        })
      }
    });
  }
});