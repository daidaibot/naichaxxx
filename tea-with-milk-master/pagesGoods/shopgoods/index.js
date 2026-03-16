let app = getApp();
let startPoint;
let tabName = ['allTabList', 'myAttendList', 'myPublishList']; // 列表名称
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    triggered: false,
    searchVal: "", // 搜索
    winHeight: "",// 窗口高度
    currentTab: 0, // 当前所在滑块的 index
    allTabList:[], // 全部
    myAttendList:[], // 我参与
    myPublishList:[], // 我发布
    scrollTop: 0, // 设置竖向滚动条位置
    windowHeight: "",
    windowWidth: "",
    recordCount: 0, //列表总条数
    pageNo: 1, //页码
    longitude:"",
    latitude:"",
    active:0,
    goodsCate:[],
    goodsList:[],
    goodsSpec:{},
    shopInfo:{},
    cateId:"",
    userInfo:"",
    car_total:0,
    setting_money:0.00,
    orderType:1,
    is_collect:0,
    storageId:0,
    cate_list_level:[],
    pid:0,
  },


 
  //生命周期函数--监听页面显示
 onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      });
    }
    //登陆信息
    var storageData = this.getStorage('user_info');
    this.setData({
      userInfo:storageData
    })
    // 获取位置信息
    this.getLocation()

    //获取位置信息
    let app = getApp()  // 获取全局变量
    if(app.storageId){
      this.setData({
        storageId:app.storageId
      })
    }
    // console.log('storageId-2',app.storageId)
    // console.log('---16')

 
    
   
    setTimeout(()=>{
      // console.log(12)
      //关闭属性   
       this.selectComponent("#bizSpecs").hideSpecs()
       this.selectComponent("#bizPay").hideSpecs() 
      this.selectComponent("#page").hideLoading()
    },2000)
}, 


onChange(event){
console.log('event',event)
  let name=event.currentTarget.dataset.name

  this.setData({
    pid:name,
    goodsList:[]
  })
  this._requestPageList();
  

},
changeOrder(events){
  this.setData({
    orderType:events.currentTarget.dataset.ordertype
  }) 
},


  
 // 获取信息
 getShop(){
  var jsonData = {
    lat:this.data.latitude,
    lng: this.data.longitude,
  }; 
  var storageData = this.getStorage('user_info');
  if(storageData){
    jsonData['token']=storageData.wx_openid
  }
  if(this.data.storageId){
    jsonData['storageId']=this.data.storageId
  }

    // console.log('---1')

  var that=this
  this.goodsShopCate(jsonData).then(res => {  
    if(res.resCode=="9999"){
      this.setStorage('shopInfo', res.data.shop_info)
      that.setData({
        cateId:res.data.cate_list[0].id,
        goodsCate:res.data.cate_list,
        goodsList:res.data.goods_list,
        shopInfo:res.data.shop_info,
        is_collect:res.data.shop_info.is_collect,
        car_total:res.data.car_total,
        setting_money:res.data.car_money_total,
        cate_list_level:res.data.cate_list_level,
        pid:res.data.pid
      })
    }else{
      wx.showToast({title: res.resMessage,icon:"none"})
    } 

  })
 }, 
 getLocation(){
  var that=this;
  wx.getLocation({
    type: 'gcj02',
    success: (res) => {
      var lat = res.latitude
      var lng = res.longitude
      that.setData({ latitude:lat, longitude: lng })  
      //商品信息
      if(getApp().order_type){
        that.setData({orderType:getApp().order_type})
      }
     // console.log('------',getApp().order_type)
      this.getShop()    
    },
    fail: function() {
      wx.showToast({
        title: '重新进入小程序',
        icon:"none",
      })
    }
  })  
},
switchNav: function (e) {
  var page = this;
  var id = e.target.id; 
  page.setData({
    currentTab: id,
    active: id,
    cateId:e.currentTarget.dataset.cateid,
    pageNo:1,
    pid:0,
    goodsList:[]
  });
 
  this._requestPageList(true);
}, 
  onLoad: function(options) {
    // 计算drawer高度，占满window
    let that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        let calc = (clientHeight - 50 - 54) * rpxR - 130;
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth,
          winHeight: calc
        });
      }
    });

    //获取位置信息
    this.getLocation()

    //获取位置信息
    let app = getApp()  // 获取全局变量
    if(app.storageId){
      this.setData({
        storageId:app.storageId
      })
    }
    if(options.storageId){
      this.setData({
        storageId:options.storageId
      })
    }

   
  },


  // 参数
  _requestPageList(isLoadMore = false, callback) {
    // isLoadMore 为true是上拉加载，不需要置空数组
    if(!isLoadMore){
      this.setData({
        allTabList:[], // 全部
        myAttendList:[], // 我参与
        myPublishList:[], // 我发布
        pageNo: 1
      });
    }
    let opt = {
      lat:this.data.latitude,
      lng: this.data.longitude,
      cateId: this.data.cateId,  
      pageNo :this.data.pageNo 
    }
    var storageData = this.getStorage('user_info');
  if(storageData){
    opt['token']=storageData.wx_openid
  }
  
  if(this.data.storageId){
    opt['storageId']=this.data.storageId
  }

  opt['pid']=this.data.pid


    this._requestPageListCom("virtualTaskList", opt, callback);
  },
  // 列表接口
  _requestPageListCom(url, params, callback) {

    this.goodsShopCate(params).then(res => {
      if (res.resCode == "9999") {
        let oldList = [];     
        oldList = this.data.goodsList;       
        const newGoodsList = res.data.goods_list
        const allData = [...oldList, ...newGoodsList]     
        this.setData({
          goodsList:allData,
          recordCount: res.data.page,
          car_total:res.data.car_total,
          setting_money:res.data.car_money_total,
          cate_list_level:res.data.cate_list_level,
          pid:res.data.pid,
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
    let meetId = events.currentTarget.dataset.posid;
     this.router("/pagesGoods/detail/index?id="+meetId)
  },
  // 上拉加载  滚动到底部/右边时触发
  allLoadMore(e){
    let _self = this;
    if (this._allLoadMore || _self.data[tabName[this.data.currentTab]].length >= _self.data.recordCount) return
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
  
  //获取属性信息
  showSpecs(event){
    let data={
      goodsId:event.currentTarget.dataset.goodsid
    }  
    let that=this
    this.goodsAttr(data).then(res =>{
      if(res.resCode=='9999'){
        this.selectComponent("#bizSpecs").showSpecs(res.data)
      }else{
        wx.showToast({
          title: '系统繁忙，请稍后重试！',
          icon:"none",
        })
      }
    })
  },
  //购物车列表信息 
  show_pay(){  
    let that=this
    let data={
      storageId:this.data.shopInfo.storageId,
       token:this.getStorage('user_info').wx_openid
    }
    this.carList(data).then(res=>{
      if(res.resCode=="9999"){
        that.selectComponent("#bizPay").showSpecs(res.data,2)
      }else{
          wx.showToast({title:res.resMessage,icon:"none"})
      }
    })
  },
  //添加购物车返回信息
  specs_pay(event) {   
    let  goodsList=this.data.goodsList
    for(var i=0;i<goodsList.length;i++){
      if(goodsList[i].id==event.detail.goodsId){
        goodsList[i].car_num=event.detail.goods_number
      }
    }
    this.setData({
      car_total:event.detail.car_total,
      setting_money:event.detail.setting_money,   
      goodsList:goodsList   
    })
  },

  hb(){
    this.selectComponent("#shopInfo").showSpecs()
  },
  //修改购物车数控
  caredit(e){
    ////问题
    this.getShop()

  },
//清除购物车
delcar(e){  
  let  goodsList=this.data.goodsList
  for(var i=0;i<goodsList.length;i++){
    goodsList[i].car_num=0
  }
  this.setData({
    car_total:0,
    setting_money:0.00,
    goodsList:goodsList
  })
},
// 去结算
confirm(){
 
  // this.setStorage('shop_type', 'carts');
  this.router("/pagesOrder/dispatch/index")
},
  // 方法
  getPhoneNumber (e) {
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData
    var that = this;
    wx.login({
      success: res => {        
        var data = {
          token:that.data.userInfo.wx_openid,
          code: res.code,
          encryptedData: telObj,
          iv: ivObj
        }
        that.getPhone(data).then(res =>{
          if(res.resCode=='9999'){
            that.setStorage('user_info', res.data);
            that.setData({
              userInfo:res.data
            })
          }else{
            wx.showToast({
              title: '请重新试一下！',
              icon:'none'
            }) 

          }
         

        })
      }
    })
 
  }
 
   
})