// pages/mine/gzh/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    shopInfo:'',
    recommendId:'',
    storageId:'',
    userInfo:'',
    realname:'',
    contact:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo=this.getStorage('user_info')
    if(!userInfo){
      console.log(1)
      this.routeToLogin()
    }
   
    let dataJson={
      storageId:options.storageId
    }
    this.ShopJoinInfo(dataJson).then(res=>{
      if(res.resCode=='9999'){
        this.setData({
          shopInfo:res.data,
          recommendId:options.recomId,
          userInfo,
          storageId:options.storageId

        })
      }
    })
  }, 
  
  //加入合作商
  doJoin(event){
    let userInfo=this.getStorage('user_info')
    let obj_data={
      realname:this.data.realname,
      contact:this.data.contact,
      storageId:this.data.storageId,
      token:userInfo.wx_openid
    }

    if(!obj_data.realname){
      this.$showToast('请输入姓名')
      return
    }
    if(!obj_data.contact){
      this.$showToast('请输入联系方式')
      return
    }
    this.doJoinStaff(obj_data).then(res=>{
      this.$showToast(res.resMessage)
    })

  
  }
})