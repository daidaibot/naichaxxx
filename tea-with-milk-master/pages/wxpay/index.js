// pages/wxpay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },


  pay(){
    console.log(11)
    wx.request({
      url: "http://shop.net/api/login/pay",
      method:"POST",
      data:{},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data.data.data)

        res = res.data.data.data


        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success: res => {
            // 支付成功，跳转到下一个页面
            wx.navigateTo({
              url: '/pages/order/success'
            })
          },
          fail: res => {
            // 支付失败，展示支付失败提示
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
        



      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})