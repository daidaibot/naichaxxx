// pages/mine/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    list: [],
    user_info:"",
  },

  onChange(event) {
    // 需要手动对 checked 状态进行更新
   let id=event.currentTarget.dataset.id
   let check=event.detail
   let list=this.data.list
   let staff_status=0
   for (let j = 0; j < list.length; j++) {
      if(list[j].id==id){
        list[j].staff_status=check
      }
   }
   this.setData({list})
   if(check) staff_status=1
   else staff_status=0
   this.editStaff({id,staff_status}).then(res=>{
        this.$showToast(res.resMessage)
   })
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let user_info=this.getStorage('user_info')
    this.setData({
      user_info
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that=this    
    let user_info=that.getStorage('user_info') 
    
    // if(user_info.is_type !=1){
    //   // this.$showToast('您无权操作！')
    //   setTimeout(()=>{
    //     wx.navigateBack({
    //       delta: 1, // 返回上一级页面。
    //       success: function() {
    //           console.log('成功！')
    //       }
    //     })
    //   },1000)
    // }

    that.staff_list({token:user_info.wx_openid,storageId:user_info.storageId}).then(res=>{
       if(res.resCode=='9999'){
         that.setData({
           list:res.data.list
         })
       }
    })
  },

  //分享
  onShareAppMessage() {
    let userInfo=this.getStorage('user_info')
    let shopInfo=userInfo.shopInfo
    return {
      title: `您的BOSS邀您使用【${shopInfo.storage_shop_name}】,注册员工`,
      imageUrl: shopInfo.shop_logo,
      path: "/pagesUser/joinStaff/index?storageId="+shopInfo.id,
      success: (res) => { }
    } 
  }

})