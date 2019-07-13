const app = getApp();

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  goPage: function (ev) {
    let dataset = ev.currentTarget.dataset;
    let url = dataset.url;
    app.hrefToPageFn(url);
  }
});