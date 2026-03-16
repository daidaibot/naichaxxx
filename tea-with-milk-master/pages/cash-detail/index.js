// var WxParse = require('../../utils/wxParse/wxParse');
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    article:"",
    type:'',
  },
  onShow() {
    let that=this
    this.cash_detail({type:this.data.type}).then(res => {  
      if(res.resCode=='9999'){
        // var temp = WxParse.wxParse('article', 'html', res.data.content, that, 5);
        that.setData({
          article:res.data.content 
         }) 
      }else{
        wx.showToast({
          title: res.resMessage,
          icon:'none'
        })
      }
    })
    
  },
  onLoad(e){  
    console.log(e)  
    this.setData({
      type:e.type
    })
    setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
    },2000)
  },
})