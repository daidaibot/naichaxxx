// pages/mine/gzh/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    list:{},
  },
  onLoad(){
    this.getAbout().then(res=>{
      if(res.resCode=='9999'){
        this.setData({
          list:res.data
        })
      }
    })
  },
  copyWechatCode(){
    this.$setClipboardData(this.data.list.serviceWechat).then(()=>{
      this.$showToast("复制成功")
    })
  },

    //用户二维码保存到本地相册
    saveQrcode: function () {
      var that = this;
      wx.getImageInfo({
        src: that.data.list.OfficialQRcode,
        success: function (ret) {
          var path = ret.path;
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success(result) {
              if (result.errMsg === 'saveImageToPhotosAlbum:ok') {
                wx.showToast({
                  title: '保存成功',
                })
              }
            }
          })
        }
      })
    },
})