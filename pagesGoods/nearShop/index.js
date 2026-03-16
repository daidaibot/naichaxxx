// pagesUser/collect/index.js
const app = getApp()
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    list:{},
    latitude:39.908860,
    longitude:116.397390,
    markers: [{     
      iconPath: "/images/marker.png",
      id: 0,
      latitude: 39.908860,
      longitude: 116.397390,
      width: 30,
      height: 30,
      label: {
        content: "这里是标签",
        color: "#ffffff",
        fontSize: 14,
        borderRadius: 5,
        bgColor: "#000000",
        padding: 5
      }
    }],
    search:"",
    userInfo:{},
    pageNo :1,
    allTabList:[]


  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

      console.log('options',options)
      // 计算drawer高度，占满window
      let that = this;
      //  高度自适应
      wx.getSystemInfo({
        success: function (res) {
          console.log(res)
          let clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
          let calc = (clientHeight - 50 - 54) * rpxR - 130;
          // console.log(calc)
          that.setData({
            windowHeight:  res.windowHeight,
            windowWidth:  res.windowWidth,
            winHeight: calc,
            latt:options.latitude,
            lngg:options.longitude,
          });
        }
      });      
      this.getLocation()  
    },
  
  onShow(){
    this.setData({
      userInfo:this.getStorage('user_info')
    })
    setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
      
    },2000)
    this.setData({
      allTabList:[], // 全部       
      pageNo: 1
    });
    this._requestPageList(true);
  },

 


  getLocation(){    
      var that=this;
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          var lat = res.latitude
          var lng = res.longitude
          that.setData({ latitude:lat, longitude: lng })  
          
          
        },
        fail: function() {
          wx.showToast({
            title: '重新进入小程序',
            icon:"none",
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

  gostorage(optios){
    let storage_shop_name=optios.currentTarget.dataset.item.storage_shop_name
    this.$showModal({title:"温馨提示",content: '您确认切换到【'+storage_shop_name+']】门店嘛？'}).then(res=>{
      if(res.confirm){
        getApp().storageId=optios.currentTarget.dataset.item.storageId
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
  search(e){
    let search=e.detail.value
    this.setData({search})
    this.getLocation()
    
  },
  
// 参数
_requestPageList(isLoadMore = false, callback) {
  if(!isLoadMore){
    this.setData({
      allTabList:[], // 全部       
      pageNo: 1
    });
  }
  let opt = {
    pageNo :this.data.pageNo,
    token:this.getStorage('user_info').wx_openid,
    latitude:this.data.latitude,
    longitude:this.data.longitude,
    search:this.data.search
  }   
  console.log('opt',opt) 
  // return
  this._requestPageListCom("virtualTaskList", opt, callback);
},
// 列表接口
_requestPageListCom(url, params, callback) {    
  this.shopMoreList(params).then(res => {
    if (res.resCode == "9999") {
      let oldList = [];
      oldList = this.data.allTabList;       
      const newGoodsList =res.data.list;
      const allData = [...oldList, ...newGoodsList]
      console.log(allData,'allData')     
      this.setData({
        recordCount: res.data.page,
        allTabList:allData,
        latitude:res.data.list[0].lng,
        longitude:res.data.list[0].lat,
        markers:[{
          latitude:res.data.list[0].lng,
          longitude:res.data.list[0].lat,
          label: {
            content: res.data.list[0].storage_shop_name,
          }
        }]
      })
      if(callback && typeof callback === 'function'){
        callback()
      }
    }
  })
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
      pageNo:1,
      currentTab: currentIndex
    })
  }
  this.setData({
    allTabList:[]
  });
  this._requestPageList(true);
},

// 上拉加载  滚动到底部/右边时触发
allLoadMore(e){
  let _self = this;
  if (this._allLoadMore ||  _self.data.recordCount === 0) return
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
  this._requestPageList(false, () => {
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
    this.setData({
      triggered: false
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
position(options){
  this.setData({
    latitude:options.currentTarget.dataset.info.lng,
    longitude:options.currentTarget.dataset.info.lat,
    markers:[{
      latitude:options.currentTarget.dataset.info.lng,
      longitude:options.currentTarget.dataset.info.lat,
      label: {
        content: options.currentTarget.dataset.info.storage_shop_name,
      }
    }]
  })
  console.log(options)

},


  
})