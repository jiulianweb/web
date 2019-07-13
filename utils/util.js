/*请求数据*/
function httpRequest(url, method, callBack, data) {
  wx.showLoading({
    title: '加载中',
    icon: 'none',
    mask: true
  });
  wx.request({
    url: url,
    data: data || "",
    method: method,
    dataType: "json",
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('token') || ""
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if (res.data.code == 1) {
          setTimeout(function () {
            wx.hideLoading();
            callBack(res.data);
          }, 1000);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true,
            duration: 3000
          });
        }
      } else {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          mask: true,
          duration: 3000
        });
      }
    },
    fail: function () {
      setTimeout(function () {
        wx.hideLoading();
        wx.showToast({
          title: '网络繁忙，请耐心等待',
          icon: 'none',
          mask: true,
          duration: 3000
        });
      }, 1000);
    }
  })
};
/*图片上传*/
function uploadImg(url, callBack, data) {
  wx.chooseImage({
    count: 9, 
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'],      // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      wx.showLoading({
        title: '加载中',
        icon: 'none',
        mask: true
      });
      let tempFilePaths = res.tempFilePaths;
      wx.uploadFile({
        url: url,      
        filePath: tempFilePaths[0],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'token': wx.getStorageSync('token') || ""
        },
        formData: {
          user_id: data
        },
        success: function (res) {
          let data = res.data;
          callBack(res.data);
          setTimeout(function () {
            wx.hideLoading();
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '网络通讯异常，请求服务器数据失败！',
            icon: 'none',
            mask: true,
            duration: 1500
          });
        },
        complete: function () {
          setTimeout(function () {
            wx.hideLoading();
          })
        },
      })
    }
  })
}
/*请求数据不加loading*/
function sleepHttpRequest(url, method, callBack, data) {
  wx.request({
    url: url,
    data: data || "",
    method: method,
    dataType: "json",
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('token') || ""
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if (res.data.code == 1) {
          setTimeout(function () {
            callBack(res.data);
          }, 1000);
        }
      } 
    }
  })
};

module.exports = {
  httpRequest: httpRequest,
  sleepHttpRequest: sleepHttpRequest,
  uploadImg: uploadImg
};
