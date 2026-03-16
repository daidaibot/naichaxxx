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
    pageENo:1,
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
    orderType:2,
    is_collect:0,
    storageId:0,
    cate_list_level:[],
    pid:0,
    value:1,
    currentTab:1,
    currentETab:1,
    banner_list:[],
    evaCount:0,
    evaCount_bad:0,
    evaCount_ok:0,
    evaCount_image:0,
    scrollTop:0,
  },

 
  onHide(){
    this.selectComponent("#bizSpecs").hideSpecs()
    this.selectComponent("#bizPay").hideSpecs() 
 },

 
  //生命周期函数--监听页面显示
 onShow() {    
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }

    //登陆信息
    var storageData = this.getStorage('user_info');
    this.setData({
      userInfo:storageData
    })

    //获取位置信息
    let app = getApp()  // 获取全局变量
    if(app.storageId !=this.data.storageId){
      this.setData({
        storageId:app.storageId,
        cateId:0,
        pid:0,
      })
    }
    
    // 获取位置信息
    this.getLocation()

    
    setTimeout(()=>{
      // console.log(12)
      //关闭属性   
      //  this.selectComponent("#bizSpecs").hideSpecs()
      //  this.selectComponent("#bizPay").hideSpecs() 
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


  //店铺收藏
  collect(){
    let that=this
    var storageData = this.getStorage('user_info');
    let shopUser= this.getStorage('shopInfo')
 
    this.getCollect({token:storageData.wx_openid,storageId:shopUser.storageId}).then(res=>{
        if(res.resCode=='9999'){
          if(res.resMessage=='收藏成功'){           
            that.setData({is_collect:1})
            wx.showToast({title: res.resMessage,icon:"none"})
          }else if(res.resMessage=='取消收藏'){
            that.setData({is_collect:0})
            wx.showToast({title: res.resMessage,icon:"none"})
          }else{
            wx.showToast({title: res.resMessage,icon:"none"})
          }
        }
         
    })
   
    
  },
 // 获取信息
 getShop(){
  var jsonData = {
    lat:this.data.latitude,
    lng: this.data.longitude,
    cateId: this.data.cateId,  
  }; 
  var storageData = this.getStorage('user_info');
  if(storageData){
    jsonData['token']=storageData.wx_openid
  }
  if(this.data.storageId){
    jsonData['storageId']=this.data.storageId
  }

  if(this.data.pid){
    jsonData['pid']=this.data.pid
  }



    console.log('---1',jsonData)

  var that=this
  this.goodsCate(jsonData).then(res => {  
    if(res.resCode=="9999"){
      this.setStorage('shopInfo', res.data.shop_info)
      that.setData({      
        goodsCate:res.data.cate_list,
        goodsList:res.data.goods_list,
        shopInfo:res.data.shop_info,
        is_collect:res.data.shop_info.is_collect,
        car_total:res.data.car_total,
        setting_money:res.data.car_money_total,
        cate_list_level:res.data.cate_list_level,
        pid:res.data.pid,
        banner_list:res.data.banner_list,
      })

      if(!this.data.cateId){
        that.setData({
          cateId:res.data.cate_list[0].id,
        })
      }
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
        title: '请开启定位',
        icon:"none",
      })
    }
  })  
},
switchNav: function (e) {
  var page = this;
  var id = e.currentTarget.id; 
  console.log('id',id)
  page.setData({
    // currentTab: id,
    active: id,
    cateId:e.currentTarget.dataset.cateid,
    pageNo:1,
    pid:0,
    goodsList:[]
  });
 
  this._requestPageList(true);
}, 

onPageScroll:function(e) {
  // console.log('滚动条位置', e.scrollTop)
  this.setData({
      scrollTop: e.scrollTop
    })
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
          winHeight: calc,
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

    this.goodsCate(params).then(res => {
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
          banner_list:res.data.banner_list,
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
    // this.setData({
    //   scrollTop:0
    // });
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
        that.selectComponent("#bizPay").showSpecs(res.data)
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
 
  this.setStorage('shop_type', 'carts');
  this.router("/pagesOrder/confirm/index?orderType="+this.data.orderType)
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
 
  },

    // 点击标题切换当前页时改变样式
    changeNav: function (e) {
      let currentIndex = e.target.dataset.current;
      if (this.data.currentTaB == currentIndex) {      
        return false;
      } else {
        this.setData({
          pageENo:1,
          currentTab: currentIndex
        })
      }
      // this.setData({
      //   new_goods:[]
      // });
      if(currentIndex==2)  this.EvalPageList()
     
    },



      // 参数
  EvalPageList(isLoadMore = false, callback) {
    // isLoadMore 为true是上拉加载，不需要置空数组
    if(!isLoadMore){
      this.setData({
        allTabList:[], // 全部       
        pageENo: 1
      });
    }
    let opt = {
      pageNo :this.data.pageENo,
      storageId:this.data.shopInfo.storageId,
      currentTab:this.data.currentETab
    }
    
    this.EvalPageListCom("virtualTaskList", opt, callback);
  },
  // 列表接口
  EvalPageListCom(url, params, callback) {    
    this.evaluate_list(params).then(res => {  
      
      if (res.resCode == "9999") {       
        let oldList = [];     
        oldList = this.data.allTabList;
        const newGoodsList = res.data.list
        const allData = [...oldList, ...newGoodsList]
        this.setData({
          recordCount: res.data.page,
          allTabList:allData,
          evaCount:res.data.evaCount,
          evaCount:res.data.evaCount,
          evaCount_bad:res.data.evaCount_bad,
          evaCount_ok:res.data.evaCount_ok,
          evaCount_image:res.data.evaCount_image,
          eval_socre:res.data.eval_socre
        })
        if(callback && typeof callback === 'function'){
          callback()
        }
      }
    })
  },
 
    // 上拉加载  滚动到底部/右边时触发
    EallLoadMore(e){
      let _self = this;
      if (this._allLoadMore  || _self.data.recordCount === 0) return
      this._allLoadMore = true;
  
      this.setData({
        pageENo: ++_self.data.pageNo
      });
      this.EvalPageList(true, () => {
        _self._allLoadMore = false;
      });
    },
    // 下拉刷新接口
    EonAllRefresh() {
      if (this._allFreshing) return
      this._allFreshing = true
      this.EvalPageList(false, () => {
        // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
        this.setData({
          triggered: false
        })
        this._allFreshing = false
      });
    },
    EpScrollTo(){
      // 返回顶部
      this.setData({
        scrollTop:0
      });
    },

    changeETab:function(e){
      this.setData({
        pageENo:1,
        allTabList:[],
        currentETab:e.currentTarget.dataset.current
      })
       this.EvalPageList(true);
    }


})