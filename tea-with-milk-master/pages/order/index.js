let app = getApp();
let startPoint;
let tabName = ['allTabList', 'myAttendList', 'myPublishList']; // 列表名称
Page({
  onShow() {

      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 3
        })
      }

    setTimeout(()=>{
      this.setData({
        currentTab:11,
        allTabList:[]
      })
      this._requestPageList(true);
      console.log(12)
      this.selectComponent("#page").hideLoading()
    },2000)
   

  },
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    triggered: false,   
    winHeight: "",// 窗口高度
    currentTab: 11, // 当前所在滑块的 index
    allTabList:[], // 全部    
    scrollTop: 0, // 设置竖向滚动条位置
    windowHeight: '',
    windowWidth: '',
    recordCount: 0, //列表总条数
    pageNo: 1, //页码
    orderType:1
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
    
   
  },


  // 参数
  _requestPageList(isLoadMore = false, callback) {
    // isLoadMore 为true是上拉加载，不需要置空数组
    if(!isLoadMore){
      console.log("ok----")
      this.setData({
        allTabList:[], // 全部       
        pageNo: 1
      });
    }
    let opt = {
      pageNo :this.data.pageNo,
      orderType:this.data.orderType,
      token:this.getStorage('user_info').wx_openid,
      //token:'o4--g6_m5WmSiN5TxyIh2HZp88AQ',
      status:this.data.currentTab
    }
    
    this._requestPageListCom("virtualTaskList", opt, callback);
  },
  // 列表接口
  _requestPageListCom(url, params, callback) {    
    this.listIngNew(params).then(res => {      
      if (res.resCode == "9999") {       
        let oldList = [];     
        oldList = this.data.allTabList;
        console.log('--oldList--',oldList)
      

        const newGoodsList = res.data.list
        const allData = [...oldList, ...newGoodsList]
        console.log('allData',allData)
        this.setData({
          recordCount: res.data.page,
          allTabList:allData
        })
        if(callback && typeof callback === 'function'){
          callback()
        }
      }
    })
  },

  // changeTab: function (e) {
  //   this.setData({
  //     currentTab: e.detail.current
  //   });
  //   this._requestPageList();
  // },
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
  // 详情
  goDetails:function(events){
    //console.log(events)
    let orderId = events.currentTarget.dataset.orderid;
    this.router("/pagesOrder/goDetails/index?orderId="+orderId)
  },
  // 上拉加载  滚动到底部/右边时触发
  allLoadMore(e){
    let _self = this;
    if (this._allLoadMore  || _self.data.recordCount === 0) return
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

  changeOrder(events){
    let ordertype=events.currentTarget.dataset.ordertype    
    this.setData({
      orderType:ordertype,
      allTabList:[],
      pageNo: 1  
    })
    this._requestPageList(true)    
  },
  //立即支付
  dopay(event){  
    let order_no=event.currentTarget.dataset.pay_no
    let goods_total=event.currentTarget.dataset.goods_total
    this.router("/pagesOrder/wxPay/index?order_no="+order_no+"&goods_total="+goods_total+"&orderpay=1")   
  },
  //取消订单
  cancel(event){    
    this.$showModal({content: '确定要取消订单吗？'}).then(res=>{
      if(res.confirm){
        this.orderCancel({orderId:event.currentTarget.dataset.orderid}).then(res=>{
          this.$showToast(res.resMessage)
          setTimeout(()=>{
            this.setData({
              allTabList:[]
            });
            this._requestPageList(true);
          },2000)

          
          return
        })       
      }else{
      }
    })
  },
    //确认收货
    payok(event){
      let that = this;
      this.$showModal({content: '您确定已经收到货物了吗？',title:'提示'}).then(res=>{
        if(res.confirm){
          let obj_data={
            token:this.getStorage('user_info').wx_openid,
            order_id:event.currentTarget.dataset.orderid
          }
          this.confirm_receipt(obj_data).then(res=>{
            this.$showToast(res.resMessage) 
            setTimeout(()=>{
              that.setData({
                currentTab:4,
                allTabList:[]
              })
              that._requestPageList(true);
            },3000)          
          })
        }
      })
    },

    payStorage(e){
      let storageId=e.currentTarget.dataset.storageid
      getApp().storageId=storageId
       wx.switchTab({
         url: '/pages/classify/index',        
       })    
    },
      // 拨打电话
  makeCall(e) {
    // 获取绑定的电话号码  我这里的电话号是绝对正确的，如果绑定的电话号码有可能不正确建议判断一下
    console.log(e.currentTarget.dataset.contact);
    // 调用微信的拨打电话API 安卓直接跳转到手机拨号页面  苹果要用户点击同意才跳转
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.contact,
    })
  },

  //配送详情
  send(events){
    let orderid=events.currentTarget.dataset.orderid
    this.router('/pages/shop_map/index?orderid='+orderid)
  },
   //立即评价
   doevaluate(event){
    let order_id=event.currentTarget.dataset.orderid  
    console.log(order_id)
    this.router("/pagesOrder/evaluate/index?orderId="+order_id)
  }
})