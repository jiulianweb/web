const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    index: "",
    type: "",
    status: false,
    id: "",
    count: "",
    meetBaDetail: "",
    commentList: []
  },
  onLoad: function (options) {
    let id = options.id;
    this.setData({
      id: id
    })
    let dataUrl = app.globalData.baseUrl + "loveba/info/loveba_id/" + id;
    util.httpRequest(dataUrl, "get", this.getMeetBaDetailFn);
  },
  onShow: function () {

  },
  getMeetBaDetailFn: function (res) {
    let backData = res.data;
    if (backData) {
      if (backData.info) {
        backData.info.pics = backData.info.pics.split(",");
        this.getComments();
      }
      this.setData({
        meetBaDetail: backData,
        status: true
      })
    }
  },
  getComments: function(){
    let id = this.data.id;
    let dataUrl = app.globalData.baseUrl + "loveba/getmessage/loveba_id/" + id;
    util.httpRequest(dataUrl, "get", this.getCommentsFn);
  },
  getCommentsFn: function(res){
    if(res.code == 1){
      for(let i=0; i<res.data.length; i++){
        res.data[i].create_time = tips.conversionTime(res.data[i].create_time);
      }
      this.setData({
        commentList: res.data
      })
    }
  },
  clickLive: function(ev){
    let userId = wx.getStorageSync("userId");
    let type = ev.currentTarget.dataset.type;
    let index = ev.currentTarget.dataset.index;
    let id = "";
    let dataUrl = app.globalData.baseUrl + "loveba/zan";
    if (type == 1){
      console.log(index)
      id = ev.currentTarget.dataset.id;
    }else{
      id = this.data.id;
    }
    let reqData = {
      user_id: userId,
      loveba_id: id
    }
    this.setData({
      type: type,
      index: (index === undefined) ? "" : index
    })
    console.log(JSON.stringify(reqData));
    util.httpRequest(dataUrl, "post", this.clickLoveFn, reqData);
  },
  clickLoveFn: function(res){
    let type = this.data.type;
    let index = this.data.index;
    if (res.code == 1) {
      let meetBaDetail = this.data.meetBaDetail;
      let commentList = this.data.commentList;
      console.log(type)
      if (!type){
        meetBaDetail["zaned"] = true;
        meetBaDetail.zan_num = meetBaDetail.zan_num + 1;
      }else{
        if (index){
          commentList[index]["zaned"] = true;
        }
      }
      this.setData({
        meetBaDetail: meetBaDetail,
        commentList: commentList
      })
    }
  },
  bindKeyInput(ev) {
    let userId = wx.getStorageSync("userId");
    let id = this.data.id;
    let value = ev.detail.value;
    let dataUrl = app.globalData.baseUrl + "loveba/addmessage";
    let reqData = {
      user_id: userId,
      loveba_id: id,
      messge: value
    }
    if (!value){
      tips.tipsFn("请输入评论内容");
      return;
    }
    console.log(JSON.stringify(reqData));
    util.httpRequest(dataUrl, "post", this.commentsFn,reqData);
  },
  commentsFn: function(res){
    let meetBaDetail = this.data.meetBaDetail;
    meetBaDetail.message_num = meetBaDetail.message_num + 1;
    if(res.code == 1){
      this.getComments();
      this.setData({
        meetBaDetail: meetBaDetail,
        count: ""
      })
    }
  }
});