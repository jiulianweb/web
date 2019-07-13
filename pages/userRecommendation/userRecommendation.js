const app = getApp();
const util = require('../../utils/util.js');
let col1H = 0;
let col2H = 0;

Page({

  data: {
    status: true,
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    searchText: '',
    reqData: {
      city: '',
      school: '',
      major: '',
      page: 'all'
    }
  },

  onLoad: function () {
    
  },
  onShow: function(){
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        this.loadImages();
      }
    })
  },
  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }
    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;
    if (this.data.images.length === 1) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      if (col1H <= col2H) {
        col1H += imgHeight;
        col1.push(imageObj);
      } else {
        col2H += imgHeight;
        col2.push(imageObj);
      }
    }
    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },
  getMsgFn(data) {
    let images = [];
    this.setData({
      loadingCount: 0,
      images: [],
      col1: [],
      col2: [],
    });
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].imgs) {
        images.push({
          pic: data.data[i].imgs.split(',')[0],
          height: 0,
          major: data.data[i].major,
          school: data.data[i].school,
          user_id: data.data[i].user_id
        });
      }
    }

    let baseId = "img-" + (+new Date());
    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
    }
    this.setData({
      loadingCount: images.length,
      images: images,
      searchText: ''
    });
  },
  loadImages: function () {
    let userId = wx.getStorageSync("userId");
    let url = app.globalData.baseUrl + 'lovelist/getlist/user_id/' + userId + '/';
    util.httpRequest(url, "get", this.getMsgFn);
  },
  clickRefuse: function () {
    this.setData({
      status: false
    });
  },
  clickAccept: function (ev) {
    let dataset = ev.currentTarget.dataset;
    let url = dataset.url;
    app.hrefToPageFn(url);
  },
  goPage: function (ev) {
    let dataset = ev.currentTarget.dataset;
    let id = ev.currentTarget.dataset.userid;
    let url = dataset.url+'?userId='+id;
    app.hrefToPageFn(url);
  },
  searchFn(ev) {
    let text = ev.detail.value;
    let url = app.globalData.baseUrl + 'lovelist/search';
    util.httpRequest(url, "post", this.getMsgFn, {key: text});
  }
})