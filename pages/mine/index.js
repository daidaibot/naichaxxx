// pages/mine/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    isShow:false,
    userlevel: "普通会员",
    level_intro:'享受全场优惠，全场折扣',
    userInfo: {},
    banner_list:{},
    recommendId:'',
     moduleList: [  

      {icon: '/images/resource/ic_czhizxin@2x.png', name: '充值中心', openType: '', isauth: false, url: '/pagesUser/recharge/index'},   
      {icon: '/images/resource/ic_woddizhi@2x.png', name: '我的地址', openType: '', isauth: false, url: '/pagesUser/address/index'},
      {icon: '/images/resource/ic_tuijfenx@2x.png', name: '我的收藏', openType: '', isauth: false, url: '/pagesUser/collect/index'},
      // {icon: '/images/resource/ic_lxikefu@2x.png',  name: '联系客服', openType: 'contact', isauth: false, url: '/pagesUser/service/index'},
      // {icon: '/images/resource/ic_fenxzxin@2x.png', name: '分享好友', openType: 'share', isauth: false, url: '/pagesUser/share/index?type=share'},
      // {icon: '/images/resource/ic_jifensc@2x.png', name: '投资店铺',  openType: '', isauth: false, url: '/pagesUser/selectList/index'},
      // // {icon: '/images/resource/ic_tzhiggao@2x.png', name: '通知公告',  openType: '', isauth: false, url: '/pagesUser/notice/index'},
       {icon: '/images/resource/ic_wodshouyi@2x.png', name: '收益明细', openType: '', isauth: false, url: '/pages/moneylog/index'},
       {icon: '/images/resource/ic_tduigli@2x.png', name: '团队管理', openType: '', isauth: false, url: '/pagesUser/groupInfo/index'},
      // // {icon: '/images/resource/ic_swuhezuo@2x.png', name: '我要加盟',  openType: '', isauth: false, url: '/pagesUser/cooperate/index'},
      // {icon: '/images/resource/ic_swuhezuo@2x.png', name: '我要加盟',  openType: '', isauth: false, url: '/pagesUser/about/index'},      
      // // {icon: '/images/resource/ic_czhizxin@2x.png', name: '充值中心', openType: '', isauth: false, url: '/pagesUser/recharge/index'},   
      // {icon: '/images/resource/ic_czhizxin@2x.png', name: '会员权益', openType: '', isauth: false, url: '/pagesUser/memberLevel/index'},     
       {icon: '/images/resource/ic_wodkaq@2x.png',   name: '我的卡券', openType: '', isauth: false,url: '/pagesUser/coupon/index'},     
       {icon: '/images/resource/ic_qdaozxin@2x.png', name: '签到中心', openType: '', isauth: false, url: '/pagesUser/sign/index'},      
       {icon: '/images/resource/ic_jifensc@2x.png',  name: '积分商城', openType: '', isauth: false, url: '/pagesUser/points/index'},
      
      
    
    
    ],
    shopList: [
      {icon: '/images/resource/ic_sjiagli.png', name: '商家管理',  openType: '', isauth: false, url: '/pagesUser/onScan/index'},
      {icon: '/images/resource/ic_ddangli@2x.png', name: '订单管理',  openType: '', isauth: false, url: '/pagesUser/shopOrder/index'},
      {icon: '/images/resource/ic_wodshouyi.png', name: '商家收益', openType: '', isauth: false, url: '/pagesUser/income/index'},
      {icon: '/images/resource/ic_yuanggli.png', name: '员工管理',  openType: '', isauth: false, url: '/pagesUser/staff/index'},
      // {icon: '/images/resource/ic_czhizxin@2x.png',  name: '商品管理', openType: '', isauth: false, url: '/pagesGoods/goods/index'},
      // {icon: '', name: '',  openType: '', isauth: false, url: ''},
      // {icon: '', name: '',  openType: '', isauth: false, url: ''},
      // {icon: '', name: '',  openType: '', isauth: false, url: ''},
    ],
    moreList: [

      {icon: '/images/resource/ic_sjiagli@2x.png', name: '派发管理',  openType: '', isauth: false, url: '/pagesGoods/shopgoods/index'},
      // {icon: '/images/resource/ic_gyuwomen@2x.png', name: '关于我们',  openType: '', isauth: false, url: '/pagesUser/about/index'},
      {icon: '', name: '',  openType: '', isauth: false, url: ''},
      {icon: '', name: '',  openType: '', isauth: false, url: ''},
      {icon: '', name: '',  openType: '', isauth: false, url: ''},
     
    ],
    salesman:[
      {icon: '/images/resource/ic_sjiagli@2x.png', name: '店铺管理',  openType: '', isauth: false, url: '/pagesUser/shopList/index'},
      {icon: '/images/resource/shop_apply.png', name: '店铺报备',  openType: '', isauth: false, url: '/pagesUser/selectShop/index'},
      {icon: '/images/resource/level_name.png',   name: '调整等级', openType: '', isauth: false,url: '/pagesUser/adjust/index'}, 

    ],

    loading:false
  },
  onShow() {

    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 4
        })
      }

    var storageData = this.getStorage('user_info');
    var that=this
    if(storageData){
      this.getUserInfo(storageData.wx_openid)
    } 
    
    this.bannnerList({type:1}).then(res=>{
      that.setData({
        banner_list:res.data.banner_list
      })
    })
    
  },
  onLoad(options){  
    if(options && options.q && options.q != "undefined"){
        let scene = decodeURIComponent(options.q)
        let temp = this.getwxUrlParam(scene)
        if(temp && temp.memberId){
          this.setData({recommendId:temp.memberId})
        }
    }
    if(options.memberId) this.setData({recommendId:options.memberId})
    setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
    },2000)
  },

  //充值
  docash(){
    this.router("/pages/docash/index")
  },
  //优惠券
  coupon(){
    this.router("/pagesUser/coupon/index")
  },

  //积分
  dopoints(){
    this.router('/pagesUser/points/index')
  },

  routeUrl(events){
    let url=events.currentTarget.dataset.url
    

    if(url =="/pagesUser/share/index?type=share"  || url =="/pagesUser/service/index"){

   
  
    }else{      
      this.router(url)      
    }
  },



  //拒接
  rejectInfo(){
    this.setData({
      isShow:false 
     })
  },

  //开通会员卡
  getUserProfileUrl(options){
    let that=this
    this.setData({
      loading:true
    })
    let levelId=options.currentTarget.dataset.levelid
    this.wxPayLevel({
      levelId:levelId,
      token:this.getStorage("user_info").wx_openid,
    }).then(rest=>{
      if(rest.resCode=="9999"){
        let res = rest.data
        that.setData({loading:false})
        // console.log(res)
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success: res => {
            // 支付成功，跳转到下一个页面
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000,
              //显示透明蒙层，防止触摸穿透
              mask:true,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                    that.onShow()
                    that.setData({isShow:false})
                }, 1500) //延迟时间
              }
            })
          },
          fail: res => {
            that.setData({loading:false})
            // 支付失败，展示支付失败提示
            wx.showToast({
              title: '支付失败',
              icon: 'error',
              
            })
            that.onShow()
            that.setData({isShow:false})
          }
        })            
      }else{
        wx.showToast({title:rest.resMessage,icon:"none"})
      }

    })
  },


  //同意
  getUserInfo(wx_openid){
      var that=this;    
      var jsonData = {
        token:wx_openid
      };                    
      that.getUser(jsonData).then(res => {                        
        if(res.resCode=='9999'){         
          that.setStorage('user_info', res.data);
          that.setData({
            userInfo:res.data
          })
        }
      })
  },

  
  onShareAppMessage() {
      return {
        title: `您的好友邀您使用【${this.data.project_cn}】`,
        imageUrl: '/images/common/share.jpg',
        path: "/pages/mine/index?memberId="+this.data.userInfo.id,
        success: (res) => { }
      }   
  },

   //开通会员
   dolevel(e){ 
     this.router('/pagesUser/memberLevel/index')    
    //  this.setData({
    //   isShow:true
    //  })
   },
   //查看店铺信息
   doshopList(){
     this.router("/pagesUser/shopList/index?type=1")
   },

   doSelectshopList(){
    this.router("/pagesUser/shopList/index?type=2")
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
})