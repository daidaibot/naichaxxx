
const app = getApp()
Page({ 
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    userId:'',
    time:'',
    memberInfo:{},
    userbalace:'',
    remark:''
  },  
  onLoad(options) {
    if(options && options.q && options.q != "undefined"){
      console.log(options.q);
      const qrUrl = decodeURIComponent(options.q) 
      // console.log(qrUrl);
      let jsonUrl = this.getwxUrlParam(qrUrl);
      this.setData({
        userId:jsonUrl.u,
        time:jsonUrl.t
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
 
  onShow() {
    var storageData = this.getStorage('user_info');
    if(storageData.wx_openid==undefined){   
      this.router("/pages/login/index")
    }else{      
      this.setData({
        userInfo:storageData
      }) 
    } 
    if(!this.data.userId){
      wx.showToast({
        title: "请重新扫码~",
        icon:'none'
      })
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/home/index',
        })
      }, 200)
    }
    this.getMemberInfo()
  },


  getMemberInfo(){
    var that=this;    
    var jsonData = {
      userId:this.data.userId,
      time:this.data.time
    };                    
    that.geMember(jsonData).then(res => {                        
      if(res.resCode=='9999'){          
        this.setData({
          memberInfo:res.data
        })
      }else{
        wx.showToast({title:res.resMessage,icon:"none"}) 
        setTimeout(()=>{
          that.router('/pages/home/index','switchTab')         
        },1000)
       
      }
    })
  },

  dosubmit(){
   let obj_data={
      userbalace:this.data.userbalace,
      remark:this.data.remark,
      operatingId:this.data.userId,
      token:this.data.userInfo.wx_openid
   }

   if(!obj_data.userbalace){
    wx.showToast({title:"请输入余额~",icon:"none"})
    return
   }

   if(!obj_data.remark){
    wx.showToast({title:"请输入操作说明~",icon:"none"})
    return
   }

   this.update_balance(obj_data).then(res=>{
    wx.showToast({title:res.resMessage,icon:"none"})
   })
  }


  
  
})