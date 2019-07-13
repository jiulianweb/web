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
    ],
    tags: [{
        name: "功能建议",
      },
      {
        name: "BUG反馈",
      },
      {
        name: "内容建议",
      },
      {
        name: "体验建议",
      }
    ]
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  clickTag: function(ev){
    let tags = this.data.tags;
    let index = ev.currentTarget.dataset.index;
    if (tags[index]["checked"]) {
      tags[index]["checked"] = false;
    }else{
      tags[index]["checked"] = true;
    }
    this.setData({
      tags: tags
    })
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
    let tags = this.data.tags;
    let imgArr = this.data.imgArr;
    let count = this.data.count;
    let dataUrl = app.globalData.baseUrl + "suggest/submit";
    let bOkTag = false;
    let bOkImg = false;
    let tagsStr = "";
    let imgStr = "";
    for (let i = 0; i < tags.length; i++){
      if (tags[i]["checked"]){
        tagsStr += tags[i]["name"] + ",";
        bOkTag = true;
      }
    }
    if (bOkTag){
      tagsStr = tagsStr.slice(0, tagsStr.length-1);
    }else{
      tips.tipsFn("请选择反馈标签");
      return;
    }
    if (!count){
      tips.tipsFn("请输入反馈内容");
      return;
    }
    for (let j = 0; j < imgArr.length; j++){
      if (imgArr[j] != "../../images/addImg.png"){
        imgStr += imgArr[j] + ",";
        bOkImg = true;
      }
    }
    if (bOkImg){
      imgStr = imgStr.slice(0, imgStr.length-1);
    }else{
      tips.tipsFn("请拍照上传反馈图片");
      return;
    }
    let reqData = {
      tag: tagsStr,
      content: count,
      pics: imgStr,
      user_id: userId
    }
    console.log(JSON.stringify(reqData));
    util.httpRequest(dataUrl, 'post', this.submitReqFn, reqData);
  },
  submitReqFn: function(){
    wx.showToast({
      title: "您的建议已提交，请耐心等待回复",
      icon: 'none',
      success: function () {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 3000);
      }
    });
  }
});