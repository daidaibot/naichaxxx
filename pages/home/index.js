let app = getApp();
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    user_info:{},
    isShow:true,
    Index:[],
    goodsList:[],
    pageNo:1,
    swiperIndex:0,
    winHeight:1200,
    value:5,
    search:"",
    winHeight: "",// 窗口高度
    latitude:'',
    longitude:'',
    nav_list: ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
  },


  /* 背景随轮播图而改变 */
  getSwiperIndex(e) {
    // console.log(e);
    let currentIndex = e.detail.current;
    this.setData({
        swiperIndex:currentIndex
    })
},
    onLoad(){
     let isShow= this.getStorage('isShow')
     if(!isShow){
        this.setData({
          isShow:true
        })
     }else{
      this.setData({
        isShow:false
      })
     }

      // 计算drawer高度，占满window
    let that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        let calc = (clientHeight - 50 - 54) * rpxR - 10;
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth,
          winHeight: calc
        });
      }
    });
    },


    search(e){
      let search=e.detail.value
      this.setData({
        search,
        pageNo:1,
        goodsList:[]
      })
      this._requestPageList(true);
    },

    onShow(){

      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      
      var user_info = this.getStorage('user_info');
      if(user_info){
        this.setData({
          user_info:user_info
        })
      } 
      this.setData({
        goodsList:[]
      })
      this.getLocation()
      // this._requestPageList()
    },

    getLocation(){
      var that=this;
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          var lat = res.latitude
          var lng = res.longitude
          that.setData({ latitude:lat, longitude: lng })           
          this._requestPageList()
        },
        fail: function() {
          wx.showToast({
            title: '请开启定位',
            icon:"none",
          })
        }
      })  
    },


    order_pay(events){
      let ordertype=events.currentTarget.dataset.type
      getApp().order_type=ordertype
      console.log(ordertype)
      wx.navigateTo({
        url: '/pages/classify/index',
      })
  },
    //拒接
    rejectInfo(){
      this.setData({
        isShow:false 
      })
    },
    //同意
    getUserProfileUrl(){
      this.setData({
        isShow:false 
      })

      this.setStorage('isShow',1)     
    },
    privacy_info(){
      this.router('/pages/cash-detail/index?type=privacy');
    },

 


     // 参数
  _requestPageList(isLoadMore = false, callback) {
    // isLoadMore 为true是上拉加载，不需要置空数组
    if(!isLoadMore){
      
      this.setData({
        goodsList:[], // 全部
        pageNo: 1
      });
    }
    let opt = {
      search:this.data.search,
      pageNo :this.data.pageNo, 
      lat:this.data.latitude,
      lng: this.data.longitude,
    }
    var storageData = this.getStorage('user_info');
    if(storageData){
      opt['token']=storageData.wx_openid
    }

    // console.log('opt',opt)
    this._requestPageListCom("virtualTaskList", opt, callback);
  },
  // 列表接口
  _requestPageListCom(url, params, callback) {

    this.Index(params).then(res => {
      if (res.resCode == "9999") {            
        this.setData({
          Index: res.data,
        })
        if(callback && typeof callback === 'function'){
          callback()
        }
      }
    })
  },
  // 输入搜索 event.detail 为当前输入的值
  searchInp(e) {
    this.setData({
      searchVal: e.detail
    })
  },
  // 搜索
  searchClick(){
    this._requestPageList();
  },
  // tip: 如果在 bindchange 的事件回调函数中使用 setData 改变 current 值，则有可能导致 setData 被不停地调用，
  // 因而通常情况下请在改变 current 值前检测 source 字段来判断是否是由于用户触摸引起 event.detail = {current, source}
  // 滚动切换标签样式
  changeTab: function (e) {  
    this.setData({
      currentTab: e.detail.current
    });
    this._requestPageList();
  },
  // 点击标题切换当前页时改变样式
  changeNav: function (e) {
    let currentIndex = e.target.dataset.current;
    if (this.data.currentTaB == currentIndex) {
      return false;
    } else {
      this.setData({
        currentTab: currentIndex
      })
    }
  },
  
  // 详情
  goDetails:function(events){
    console.log('events',events)
    let meetId = events.currentTarget.dataset.posid;
    this.router("/pagesGoods/detail/index?id="+meetId)
  },


  
  // 上拉加载  滚动到底部/右边时触发
  allLoadMore(e){
    let _self = this;
    this._allLoadMore = true;
    this.setData({
      pageNo: ++_self.data.pageNo
    });
    this._requestPageList(true, () => {
      _self._allLoadMore = false;
    });
  },
  // 下拉刷新接口
  onAllRefresh() {
    if (this._allFreshing) return
    this._allFreshing = true
    this.setData({goodsList:[]})
    this._requestPageList(false, () => {
      // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
      this.setData({
        triggered: false,
       
      })
      this._allFreshing = false
    });
  },
  pScrollTo(){
    // 返回顶部
    this.setData({
      scrollTop:0
    });
  },

   //会员信息
   dorouteTo(optios){
      let type = optios.currentTarget.dataset.type
      if(type==4) this.router('/pagesUser/recharge/index')
      if(type==3) this.router('/pagesUser/coupon/index')
      if(type==2) this.router('/pagesUser/memberLevel/index')
      if(type==1) this.router('/pagesUser/groupInfo/index')
   },


   
   gostorage(optios){
    let storage_shop_name=optios.currentTarget.dataset.item.storage_shop_name
    this.$showModal({title:"温馨提示",content: '您确认切换到【'+storage_shop_name+']】门店嘛？'}).then(res=>{
     
      if(res.confirm){
        getApp().storageId=optios.currentTarget.dataset.item.id
        wx.navigateTo({
          url: '/pages/classify/index',
           success: function (e) {
            let page = getCurrentPages().pop();
            page.onShow();
          }  
        })
      }
    })
  },
  round_retain:function(num, n) {
    // num： 要处理的数  n： 保留位数
    // 十进制向右移动n为，而后利用 Math.round() 四舍五入，再向左移动n位，最后利用 toFixed() 保留小数
    return (Math.round(num * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);
},
  openMap: function (options) {  
    let shopInfo=options.currentTarget.dataset.item
   
    wx.openLocation({
     latitude: Number(this.round_retain(shopInfo.lng,5)), // 纬度，范围为-90~90，负数表示南纬
     longitude: Number(this.round_retain(shopInfo.lat,5)), // 经度，范围为-180~180，负数表示西经
     scale: 25, // 缩放比例
     name:shopInfo.storage_shop_name,
     address:shopInfo.province+shopInfo.city+shopInfo.area+shopInfo.address
    })     
   },
   
   tapMakePhoneCall:function(options){
     console.log('options',options)
     let shopInfo=options.currentTarget.dataset.item
     wx.makePhoneCall({  
       phoneNumber: shopInfo.link_phone,          
       success: function(res){          
          console.log(res)          
       },        
       fail: function(err){          
          console.log(err)          
       }         
     })
   }, 

   //会员码
   routeToUser(){
     this.router('/pages/membership/index','switchTab')
   }
  
  
})