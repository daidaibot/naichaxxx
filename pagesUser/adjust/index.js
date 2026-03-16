const app = getApp()
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    result: [],
    shopList:[],
    username: '',

  },





  //信息提交
  routeToNext(){
     var username=this.data.username;
     if(!username){
        wx.showToast({title:"请输入手机号！",icon:"none"})
        return
     }
    
    this.dolevelSend({
      token:this.getStorage('user_info').wx_openid,
      phone:username
    }).then(res=>{
       if(res.resCode=="9999"){

        wx.showToast({title:res.resMessage,icon:"none"})
        setTimeout(function () {
          //要延时执行的代码
            wx.switchTab({
              url: '/pages/mine/index',
              success: function (e) {
                let page = getCurrentPages().pop();
                page.onShow();
              }
           })
        }, 2500) //延迟时间

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


  onChange(event){   
    this.setData({
      username:event.detail
    })      
  }

})