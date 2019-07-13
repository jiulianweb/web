const baseUrl = "https://api.jiulove.cn/api/";
const baseImgUrl = "https://api.jiulove.cn/api/";
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function (res) {
      console.log(res)
    })

    wx.login({
      success: function (res) {
        let code = res.code;
        console.log(res.code)
        if (code){
          wx.request({
            url: baseUrl + 'minipserver/jscode',
            method: "post",
            data: {
              "code": code
            },
            dataType: "json",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.data.code === 1) {
                let resPonse = res.data.data;
                wx.setStorageSync('openid', resPonse.openid);
                wx.setStorageSync('sessionKey', resPonse.session_key);
                wx.setStorageSync('userId', resPonse.user_id);
              }
            }
          })
        }
      }
    })

  },
  hrefToPageFn: function (url) {
    wx.navigateTo({
      url: url
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: baseUrl,
    baseImgUrl: baseImgUrl
  }
})


