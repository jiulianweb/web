const app = getApp();

Page({
  data: {
    titles: [
      {
        title: "全部",
        flag: 0,
        active: true
      },
      {
        title: "待支付",
        flag: 1,
        active: false
      },
      {
        title: "待使用",
        flag: 2,
        active: false
      },
      {
        title: "已完成",
        flag: 3,
        active: false
      }
    ]
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  tabClick: function(ev){
    let index = ev.currentTarget.dataset.index;
    let titles = this.data.titles;
    for (let i = 0; i < titles.length; i++){
      titles[i].active = false;
    }
    titles[index].active = true;
    this.setData({
      titles: titles
    });
  },
  goPage: function (ev) {
    let dataset = ev.currentTarget.dataset;
    let url = dataset.url;
    app.hrefToPageFn(url);
  }
});