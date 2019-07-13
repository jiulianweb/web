const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');

Page({
  data: {
    tabIndex: 0,
    tab: ["热卖", "推荐", "沙冰", "奶茶", "咖啡","鲜奶"],
    tabName: "热卖",
    scrollTop: 0,
    id: "",
    shopDetail: "",
    recommends:[],       //商家推荐
    menus: []            //商家菜单
  },
  onLoad: function (options) {
    let id = options.id;
    /*详情接口*/
    let dataUrl = app.globalData.baseUrl + "business/info/id/" + id;
    /*商家推荐&商家菜单接口*/
    let menuUrl = app.globalData.baseUrl + "business/getmenulist/business_id/" + id;
    this.setData({
      id: id
    })
    util.httpRequest(dataUrl, 'get', this.getShopDetailFn);
    util.httpRequest(menuUrl, 'get', this.getmenuFn);
  },
  onShow: function () {

  },
  getShopDetailFn: function(res){
    if (res.code == 1) {
      let shopDetail = res.msg;
      if (shopDetail.imgs) {
        shopDetail.minprice = Math.ceil(shopDetail.minprice);
        shopDetail.imgs = shopDetail.imgs.split(",");
        for (let i = 0; i < shopDetail.imgs.length; i++) {
          let baseImgUrl = "https://api.jiulove.cn";
          shopDetail.imgs[i] = baseImgUrl + shopDetail.imgs[i];
        }
      }
      this.setData({
        shopDetail: shopDetail
      })
    }
  },
  getmenuFn: function(res){
    let menuArr = [];
    if (res.code == 1) {
      let arr = res.data;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].imgs) {
          arr[i].imgs = arr[i].imgs.split(",");
          for (let j = 0; j < arr[i].imgs.length; j++) {
            let baseImgUrl = "https://api.jiulove.cn";
            arr[i].imgs[j] = baseImgUrl + arr[i].imgs[j];
          }
          if (arr[i].imgs.length > 1) {
            /*只显示3张*/
            arr[i].imgs.length = 1;
          }
        }
        if (arr[i].catename == "热卖"){
          menuArr.push(arr[i]);
        }
      }
      this.setData({
        recommends: arr,
        menus: menuArr
      })
    }
  },
  clickTab: function(ev){
    let index = ev.currentTarget.dataset.index;
    let name = ev.currentTarget.dataset.name;
    let recommends = this.data.recommends;
    let menus = [];
    for (let i = 0; i < recommends.length; i++){
      if (recommends[i].catename == name){
        menus.push(recommends[i]);
      }
    }
    this.setData({
      tabIndex: index,
      tabName: name,
      menus: menus
    })
  },
  upper(e) {
    console.log(111)
  },
  lower(e) {
    console.log(222)
  },
  scroll(e) {
    console.log(e)
  }
});