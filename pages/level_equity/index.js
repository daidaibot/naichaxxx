// pages/level_equity/index.js
const app = getApp()
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    levelInfo:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {    
    this.getLevel({id:options.id}).then(res=>{
      if(res.resCode=="9999"){
        this.setData({
          levelInfo:res.data.level_info
        })
      }
    })
  },
})