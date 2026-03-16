// pages/shop_map/index.js
let app = getApp();
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    longitude: 108.299815, //地图界面中心的经度
    latitude: 22.878466, //地图界面中心的纬度
    markers: [],
    orderId:'',
  },
  onLoad(events){
     let orderid=events.orderid   
     let that=this 
     this.setData({
      orderId:orderid
     })
     
     setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
    },2000)

    
  },
  onShow(){
    let orderid=this.data.orderId 
    let that=this        
    this.getorderdetail({orderid}).then(res=>{
      if(res.resCode=='9999'){
        that.setData({
         longitude:res.data.longitude,
         latitude:res.data.latitude,
         markers:res.data.position1
        })
      }else{
        wx.showToast({title:rest.resMessage,icon:"none"}) 
      }
    })
 },
 replay(){
   this.onShow()
 }

})

