// pagesOrder/orderCancel/index.js
let app = getApp();
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
      orderId:'',  
      order_list:{},    
      shopInfo:{},
      userInfo: {},        
    },

  //生命周期函数--监听页面加载
  onLoad(options) {
    // console.log("cs",options)
    // 扫描邀请码进入
    if(options && options.q && options.q != "undefined"){
      console.log(options.q);
      const qrUrl = decodeURIComponent(options.q) 
      // console.log(qrUrl);
      let jsonUrl = this.getwxUrlParam(qrUrl);
      this.setData({
        orderId:jsonUrl.orderId
      })      
    }
    if(options && options.orderId){
      this.setData({
        orderId:options.orderId
      })   
    }
  },
  getwxUrlParam(url) {
    let theRequest = {};
    if(url.indexOf("#") != -1){
      const str=url.split("#")[1];
      const strs=str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }else if(url.indexOf("?") != -1){
      const str=url.split("?")[1];
      const strs=str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  },

  onShow(){
    let that=this     
    let obj_data={
      // token:this.getStorage('user_info').wx_openid,
      order_id:this.data.orderId
    }      
    this.orderInfo(obj_data).then(res=>{               
      if(res.resCode=="9999"){
        that.setData({
          order_list:res.data
        })
      }else{
        wx.showToast({title:res.resMessage,icon:"none"})
      }
    }) 
    var storageData = this.getStorage('user_info');
    if(storageData){
      this.setData({
        userInfo:storageData
      })
    }        
  },

  // //确认订单
  wxconfirm(){    
    if(!this.data.userInfo.wx_openid){
        this.routeToLogin()
    }
    let that=this     
    let obj_data={
      token:this.getStorage('user_info').wx_openid,
      order_id:this.data.orderId
    }  
    this.orderReceipt(obj_data).then(res=>{
      that.$showToast(res.resMessage)
      setTimeout(function () {  
        that.onShow()
      }, 3000) //延迟时间
    })   
  },
  //下拉刷新
  onPullDownRefresh() {
    // 停止下拉刷新效果
    console.log('ok',11);
     this.onShow()
     wx.stopPullDownRefresh()
     

   }
})