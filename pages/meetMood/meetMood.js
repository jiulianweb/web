const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    index: 0,
    count: "",
    imgArr: [
      "../../images/addImg.png",
      "../../images/addImg.png",
      "../../images/addImg.png"
    ],
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  bindKeyInput(ev) {
    let type = ev.currentTarget.dataset.type;
    let value = ev.detail.value;
    this.setData({
      [type]: value
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
  showImg: function (res) {
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
    let count = this.data.count;
    let bOkImg = false;
    let imgStr = "";
    let dataUrl = app.globalData.baseUrl + "loveba/add";
    if (!count){
      tips.tipsFn("请输入约会心得");
      return;
    }
    for (let j = 0; j < imgArr.length; j++) {
      if (imgArr[j] != "../../images/addImg.png") {
        imgStr += imgArr[j] + ",";
        bOkImg = true;
      }
    }
    if (bOkImg) {
      imgStr = imgStr.slice(0, imgStr.length - 1);
    }
    let reqData = {
      content: count,
      pics: imgStr,
      user_id: userId
    }
    console.log(JSON.stringify(reqData));
    util.httpRequest(dataUrl, 'post', this.submitReqFn, reqData);
  },
  submitReqFn: function () {
    wx.showToast({
      title: "提交成功",
      icon: 'none',
      success: function () {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
    });
  }
});