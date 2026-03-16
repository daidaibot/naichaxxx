const app = getApp()
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    result: [],
    shopList:[],

  },



  
  //全选处理
  checkbox(event) {
    let type=event.currentTarget.dataset.type
    let shopList=this.data.shopList 
    if(type==1){        
      for (let i = 0; i < shopList.length; i++) {  
        shopList[i].checked=true        
      } 
    } else {
      for (let i = 0; i < shopList.length; i++) {  
        shopList[i].checked=false        
      }
    }
    this.setData({
      shopList
    })
  },

  radioChange(event){
    let index=event.currentTarget.dataset.index
    let shopList=this.data.shopList 
    for (let i = 0; i < shopList.length; i++) {  
      if(shopList[i].id==index){
        if(shopList[i].checked)  shopList[i].checked=false;
        else  shopList[i].checked=true;
      }  
    } 
    this.setData({
      shopList
    })
  },


  //信息提交
  routeToNext(){
    let shopList=this.data.shopList
    let storageId=[]
    for(let i=0; i<shopList.length;i++){
      if(shopList[i].checked){
        storageId.push(shopList[i].id)
      }
    }
    if(storageId.length<=0){
      wx.showToast({title:"请选择商家信息！",icon:"none"})
      return
    }

    this.doorderSend({
      token:this.getStorage('user_info').wx_openid,
      storageId:JSON.stringify(storageId)
    }).then(res=>{
       if(res.resCode=="9999"){

        wx.showToast({title:res.resMessage,icon:"none"})
        setTimeout(function () {
          //要延时执行的代码
            wx.navigateTo({
              url: '/pagesGoods/shopgoods/index',
              success: function (e) {
                let page = getCurrentPages().pop();
                page.onShow();
              }
           })
        }, 1500) //延迟时间

       }else{
        wx.showToast({title:res.resMessage,icon:"none"})
       }
    })
    

    // console.log('shopList',shopList,storageId)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
     this.doSelectShop()
  },


  doSelectShop(){
    this.doShopList().then(res=>{
        if(res.resCode=='9999'){
          this.setData({
            shopList:res.data
          })
        }
    })
  }

})