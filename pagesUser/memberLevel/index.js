const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    userInfo:{},
    list:{},
    level:'',
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    let token=this.getStorage('user_info').wx_openid
    let that=this
    this.member_level({token}).then(res=>{
       if(res.resCode=='9999'){
        that.setData({
          list:res.data.level_info,
          level:res.data.level
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
    setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
    },2000)
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