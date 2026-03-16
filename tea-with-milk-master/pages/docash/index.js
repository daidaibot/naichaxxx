// pagesMine/address/list/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    moduleList: [
      {icon: '', name: '消费记录', openType: '', isauth: false, url: '/pages/moneylog/index'},
      // {icon: '', name: '充值说明', openType: '', isauth: false, url: '/pages/cash-detail/index?type=docash'},      
    ],
    userInfo: {},
  },

  onLoad(){
    let that=this
    this.userAccount({token:this.getStorage('user_info').wx_openid}).then(res=>{
        if(res.resCode=="9999"){
          this.setData({
            userInfo:res.data
          })
        }
    })

    


    // setTimeout(()=>{
    //   this.selectComponent("#page").hideLoading()
    // },2000)

    
    
   
  },

})