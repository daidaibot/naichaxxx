// pages/mine/gzh/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    shopInfo:'',
  },

  onLoad(){
    let userInfo=this.getStorage('user_info')
    let dataJson={
      token:userInfo.wx_openid,
      storageId:userInfo.storageId
    }
    this.shopInfo(dataJson).then(res=>{
      if(res.resCode=='9999'){
        this.setData({
          shopInfo:res.data.header
        })
      }
    })
  },

  onShow(){
    let userInfo=this.getStorage('user_info')
    // if(userInfo.is_type !=1){
    //   this.$showToast('您无权操作！')
    //   setTimeout(()=>{
    //     wx.navigateBack({
    //       delta: 1, // 返回上一级页面。
    //       success: function() {
    //           console.log('成功！')
    //       }
    //     })
    //   },1000)
    // }
  },

  onShareAppMessage() {
    let userInfo=this.getStorage('user_info')
   
    return {
      title: `您的好友邀您使用【${this.data.shopInfo.storage_shop_name}】`,
      imageUrl: userInfo.shopInfo.shop_logo,
      path: "/pages/classify/index?storageId="+this.data.shopInfo.id+"&memberId="+userInfo.id,
      success: (res) => { }
    }   
},

onChange(event){
  let storageId=event.currentTarget.dataset.id
  let status= event.detail==true?1:0
  this.setShopInfo({storageId,status}).then(res=>{
    this.onLoad()
  })
}

})