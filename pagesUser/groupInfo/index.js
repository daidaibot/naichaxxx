const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
     groupInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token=this.getStorage('user_info').wx_openid
    let that=this
     this.groupInfo({token}).then(res=>{
       if(res.resCode=='9999'){
         that.setData({
          groupInfo:res.data
         })
       }

     })
  },

  
})