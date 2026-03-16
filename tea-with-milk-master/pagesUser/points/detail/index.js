// pagesGoods/detail/index.js
const app = getApp()

Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    pointId:'',
    goodsInfo: {},
    car_total:0,
    userInfo:"",
  },
  onShow() {
    this.goodsInfo()

   
  },





  //获取商品信息
  goodsInfo(){
    let that=this 
    let obj_data={
      pointId:this.data.pointId
    }  
    this.pointsInfo(obj_data).then(res =>{
        if(res.resCode=="9999"){
          that.setData({
            goodsInfo:res.data.lists
          })
        }else{
          wx.showToast({title:res.resMessage,icon:"none"})
        }
    })
  },
  
  onLoad(event){
    console.log(event.pointId)
    this.setData({
      pointId:event.pointId
    })   
  }

 
})