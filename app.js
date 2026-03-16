// app.js

import config from './utils/config.js'
const collection = require('./utils/collection.js')
App({






  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 更新
    this.globalData.sysinfo = wx.getSystemInfoSync()
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })

 

    
  
  

  },
  globalData: {
    userInfo: {
      avatarUrl:'',
      nickName:'',
    },
    function: {
      ...collection
    },
    config
  }
})

/**
 * 全局分享配置，页面无需开启分享
 * 使用隐式页面函数进行页面分享配置
 * 使用隐式路由（wx.onAppRoute）获取当前页面路由，并根据路由来进行全局分享、自定义分享
 */
! function () {
  let shareUrl= 'https://jinning-image.zhuangdongxiang.cn/2023-12-11/2c659495d0459540cfa234ec03fbe9ae.jpg'
  //获取页面配置并进行页面分享配置
  var PageTmp = Page
  Page = function (pageConfig) {
    //1. 获取当前页面路由
    let routerUrl = "pages/home/index"
    // wx.onAppRoute(function (res) {
    //   let pages = getCurrentPages(),
    //     view = pages[pages.length - 1];
    //   routerUrl = view.route
    // })
    //2. 全局开启分享配置
    pageConfig = Object.assign({
      onShareAppMessage: function () {
        let shareInfo={}        
        shareInfo = {
          title: "您的好友邀您使用【蜀靓鸭】",
          imageUrl: shareUrl,
          path: '/'+ routerUrl,
        }
        return shareInfo
      },

      onShareTimeline: function () {
        let shareInfo={}        
        shareInfo = {
          title: "您的好友邀您使用【蜀靓鸭】",
          imageUrl: shareUrl,
          path: '/'+ routerUrl,
        }
        return shareInfo
      },


    }, pageConfig);


    // 配置页面模板
    PageTmp(pageConfig);
  }
}();
