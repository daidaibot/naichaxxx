// pagesGoods/detail/index.js
const app = getApp()
let WxParse = require('../../component/wx-parse/wxParse.js');
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    goodsId:'',
    goodsInfo: {},
    car_total:0,
    userInfo:"",
  },
  onShow() {
    this.goodsInfo()

    if(this.getStorage('user_info')){      
      this.setData({
        userInfo: this.getStorage('user_info')
      })
      this.goodsCarNum()
    }
  },

  //购物车列表信息 
  show_pay(){  
    let that=this
    let data={
       token:this.getStorage('user_info').wx_openid
    }
    this.carList(data).then(res=>{
      if(res.resCode=="9999"){
        that.selectComponent("#bizPay").showSpecs(res.data)
      }else{
          wx.showToast({title:res.resMessage,icon:"none"})
      }
    })
  },

  caredit(e){
    ////问题
    this.goodsCarNum()

  },

  delcar(e){
    this.setData({
      car_total:0     
    })
  },

  //获取手机号 方法
  getPhoneNumber (e) {
    console.log(e)
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData
    var that = this;
    wx.login({
      success: res => {        
        var data = {
          token:that.data.userInfo.wx_openid,
          code: res.code,
          encryptedData: telObj,
          iv: ivObj
        }
        that.getPhone(data).then(res =>{
          if(res.resCode=='9999'){
            that.setStorage('user_info', res.data);
            that.setData({
              userInfo:res.data
            })
          }else{
            wx.showToast({
              title: '请重新试一下！',
              icon:'none'
            })
          }
        })
      }
    }) 
  },
  //获取购物车数量
  goodsCarNum(){
      let that=this
      let obj_data={
        token:this.getStorage('user_info').wx_openid,
        storageId:this.getStorage("shopInfo").storageId
      }
      this.goodsCar_num(obj_data).then(res=>{
         if(res.resCode=="9999"){
           that.setData({
             car_total:res.data.car_num
           })
         }
      })
  },
  //获取商品信息
  goodsInfo(){
    let that=this 
    let obj_data={
      goodsId:this.data.goodsId
    }  
    this.goods_info(obj_data).then(res =>{
        if(res.resCode=="9999"){
          that.setData({
            goodsInfo:res.data
          })
        }else{
          wx.showToast({title:res.resMessage,icon:"none"})
        }
    })
  },
  //获取属性信息
  showSpecs(){
    let data={
      goodsId:this.data.goodsInfo.id
    }  
    let that=this
    this.goodsAttr(data).then(res =>{
      if(res.resCode=='9999'){
        this.selectComponent("#bizSpecs").showSpecs(res.data)
      }else{
        wx.showToast({
          title: '系统繁忙，请稍后重试！',
          icon:"none",
        })
      }
    })   
  },

   //获取优惠券
   showCoupon(){
     
    let data={
      token:this.getStorage('user_info').wx_openid,
      goodsId:this.data.goodsId
    }  
    let that=this
    this.couponList(data).then(res =>{
    
      if(res.resCode=='9999'){
        this.selectComponent("#coupon").showSpecs(res.data.list)
      }else{
        wx.showToast({
          title: '系统繁忙，请稍后重试！',
          icon:"none",
        })
      }
    })   
  },

  specs_pay(event) {  
    console.log(event)
    this.setData({
      car_total:event.detail.car_total      
    })
  },
  onLoad(event){
    this.setData({
      goodsId:event.id
    })   
  },
  //获取商品属性
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: `您的好友邀您使用【${this.data.project_cn}】`,
        imageUrl: '/images/common/share.jpg',
        path: "/pages/home/index",
        success: (res) => { }
      }
    }
  },

 
})