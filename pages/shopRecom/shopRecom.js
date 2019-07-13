const app = getApp();
const util = require('../../utils/util.js');
const tips = require('../../utils/tips.js');
const timePick = require('../../utils/dateTimePicker.js');

Page({
  data: {
    shopId: "",
    status: false,
    shops:[],
    regionIndex: 0,
    regionArray: ['杭州西湖区', '下沙区', '珠海香洲区', '宁波鄞州区', '海曙区'],
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },
  onLoad: function (options) {
    let obj1 = timePick.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    let lastArray = obj1.dateTimeArray.pop();
    let lastTime = obj1.dateTime.pop();
    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  onShow: function () {
    let dataUrl = app.globalData.baseUrl + "business/getlist";
    util.httpRequest(dataUrl, 'get', this.getShopListFn);
  },
  bindPickerChange: function(ev){
    let val = ev.detail.value;
    let regionArray = this.data.regionArray;
    let dataUrl = app.globalData.baseUrl + "business/getlistforcity";
    let reqData = {
      city: regionArray[val]
    }
    console.log(JSON.stringify(reqData))
    util.httpRequest(dataUrl, 'post', this.getShopListFn);
  },
  getShopListFn: function(res){
    if(res.code == 1){
      let shopList = res.data;
      for (let i = 0; i < shopList.length; i++){
        shopList[i].minprice = Math.ceil(shopList[i].minprice);
        shopList["checked"] = false;
        if (shopList[i].imgs){
          shopList[i].imgs = shopList[i].imgs.split(",");
          for (let j = 0; j < shopList[i].imgs.length; j++) {
            let baseImgUrl = "https://api.jiulove.cn";
            shopList[i].imgs[j] = baseImgUrl + shopList[i].imgs[j];
          }
          if (shopList[i].imgs.length > 3){
            /*只显示3张*/
            shopList[i].imgs.length = 3;
          }
        }
      }
      this.setData({
        shops: shopList,
        status: true
      })
    }
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  clickSelect: function(ev){
    let shopId = ev.currentTarget.dataset.id;
    let shops = this.data.shops;
    for (let i = 0; i < shops.length; i++){
      if (shops[i].id == shopId){
        shops[i]["checked"] = true;
      }else{
        shops[i]["checked"] = false;
      }
    }
    this.setData({
      shops: shops,
      shopId: shopId
    })
  },
  goPage: function (ev) {
    let dataset = ev.currentTarget.dataset;
    let id = ev.currentTarget.dataset.id;
    let url = "../shopHome/shopHome?id="+ id;
    app.hrefToPageFn(url);
  }
});