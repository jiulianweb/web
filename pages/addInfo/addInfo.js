const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    tagArr: [],
    hopeto: "",
    wantsay: ""
  },
  onLoad: function (options) {
    let userId = wx.getStorageSync("userId");
    let dataUrl = app.globalData.baseUrl + "tags/getlist";
    util.httpRequest(dataUrl,'get',this.getTags);
  },
  onShow: function () {

  },
  getTags: function (res){
    if(res.data){
      this.setData({
        tagArr: res.data
      });
    }
  },
  character:function(ev){
    let tags = this.data.tagArr;
    let tagName = ev.currentTarget.dataset.tagname;
    let index = ev.currentTarget.dataset.index;
    for (let i = 0; i < tags.length; i++){
      if (tags[i].tag_type_name == tagName){
        if (tags[i].tags[index]["checked"]) {
          tags[i].tags[index]["checked"] = false;
        }else{
          tags[i].tags[index]["checked"] = true;
        }
      }
    }
    this.setData({
      tagArr: tags
    })
  },
  bindKeyInput(ev) {
    let type = ev.currentTarget.dataset.type;
    let value = ev.detail.value;
    this.setData({
      [type]: value
    });
  },
  clickNext: function () {
    let userId = wx.getStorageSync("userId");
    let tagArr = this.data.tagArr;
    let hopeto = this.data.hopeto;
    let wantsay = this.data.wantsay;
    let bOk = false;
    let tagsStr = "";
    let dataUrl = app.globalData.baseUrl + "tags/setusertag";
    for (let i = 0; i < tagArr.length; i++){
      let tagName = tagArr[i].tag_type_name;
      bOk = false;
      let tagstr = "";
      for (let j = 0; j < tagArr[i].tags.length; j++){
        if (tagArr[i].tags[j]["checked"]){
          tagstr += tagArr[i].tags[j]["tag_name"] + ",";
          bOk = true;
        }
      }
      console.log(bOk)
      if (bOk){
        tagstr = tagstr.slice(0, tagstr.length - 1);
        tagsStr += tagName + ":" + tagstr + ";";
      } else{
        tips.tipsFn("请选择" + tagName);
        break;
      }
    }
    if (!bOk){
      return
    }
    if (!hopeto){
      tips.tipsFn("请填写期望的他/她");
      return;
    }
    if (!wantsay) {
      tips.tipsFn("请填写最想对他/她说");
      return;
    }
    tagsStr = tagsStr.slice(0, tagsStr.length-1);
    let reqData = {
      user_id: userId,
      tags: tagsStr,
      hopeto: hopeto,
      wantsay: wantsay
    }
    console.log(JSON.stringify(reqData));
    util.httpRequest(dataUrl, 'post', this.submitReqFn, reqData);
  },
  submitReqFn: function (res) {
    let url = "../setupTime/setupTime";
    wx.showToast({
      title: "提交成功",
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