// pages/discover/detail/index.js
const app = getApp()
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    id:'',
    newInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id:options.id
    })
    this.getNewInfo()
    
  },

  getNewInfo(){
    let obj_data={
      id:this.data.id
    }
    this.NewInfo(obj_data).then(res=>{
       if(res.resCode=='9999'){
         this.setData({
          newInfo:res.data.data
         })
       }
    })
  }



  
})