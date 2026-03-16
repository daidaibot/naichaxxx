// pages/login/index.js

const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    formData:{
      username: null,
      password: null
    },
    loading: false,
    options:{},
    router:'',
    recommendId:'',
    avatarUrl: defaultAvatarUrl,
    nickName:'',    
  },

  onChooseAvatar(e) {
    let that=this
      const { avatarUrl } = e.detail 
      wx.uploadFile({
        url: this.data.api_url+'/api/index/uploadImage',
        filePath: e.detail.avatarUrl,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
        },
        formData: { 
          fileType:'image',
          reName:'true',
          thumbnail:'true'
        },
        success(res) {
          var tem = JSON.parse(res.data)
          // 上传完成需要更新 fileList  
          console.log(tem.data.image)
          that.setData({
             avatarUrl:tem.data.image
          })
        },
      })



    app.globalData.userInfo.avatarUrl = avatarUrl  
  },
  //js文件
 // 用户修改昵称

 changeNickName(e) {
    let name = e.detail.value;
    if (name.length === 0) return;
    this.setData({
      nickName: e.detail.value
    })
    app.globalData.userInfo.nickName = name  
  },  
  getUserProfile(e){    
    var that=this;
    if(!that.data.nickName){
      that.$showToast("请填写昵称！");
      return
    }
    that.setData({loading: true})   
    wx.login({            
        success: function(res_login) {
          var jsonData = {
            code:res_login.code,           
            nickName:that.data.nickName,
            avatarUrl:that.data.avatarUrl,
            recommendId:that.data.recommendId
          };          
          that.login(jsonData).then(res => {    
            // console.log(res)                    
            if(res.resCode=='9999'){
              that.setStorage('user_info', res.data);
              wx.showToast({
                title: '登录成功',
                icon:'none'
              })  
              setTimeout(function () {  
                that.setData({loading: false}) 
                let url=that.data.router                          
                if (url == '/pages/mine/index' || url == '/pages/home/index' || url == '/pages/membership/index') {
                  wx.switchTab({
                    url: url,
                    success: function (e) {
                        let page = getCurrentPages().pop();
                        if (page == undefined || page == null) return;
                              page.onShow();
                        }
                 })
                } else if (url=='/pagesOrder/orderCancel/index'){
                  let orderInfo=that.data.options.q
                  const qrUrl = decodeURIComponent(orderInfo) 
                  let jsonUrl = that.getwxUrlParam(qrUrl)
                  url="/pagesOrder/orderCancel/index?orderId="+jsonUrl.orderId  
                  wx.redirectTo({
                    url: url,
                  })                       
                } else {                             
                  // console.log(url)
                  if(url=='/pagesGoods/detail/index'){
                      url="/pagesGoods/detail/index?id="+that.data.options.id 
                  }  
                  //console.log(url)
                  wx.redirectTo({
                    url: url,
                  })
                }
              }, 2000) //延迟时间 这里是1秒                                                    
            }else{
              wx.showToast({
                title: res.resMessage,
                icon:'none'
              })
              that.setData({loading: false})
            }
          }).catch(error => {
            wx.showToast({
              title:'请联系客服！',
              icon:'none'
            })
            that.setData({loading: false})
          })                 
        },
        fail: function() {
            n.alert("获取用户信息失败!");
        },
    });
     
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
 
  onLoad(options) {
    if(options.recommendId) this.setData({recommendId:options.recommendId})
  },
  onShow(){
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    this.setData({
      options:prevPage.options,
      router:"/"+prevPage.route
    })
  },

  
  
})