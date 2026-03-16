let app = getApp();
let startPoint;
let tabName = ['allTabList', 'myAttendList', 'myPublishList']; // 列表名称
Page({
  onShow() {
    setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
    },2000)
    // this._requestPageList(true);

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
    this._requestPageList(true);
   
  },



  // 参数
  _requestPageList(isLoadMore = false, callback) {
    // isLoadMore 为true是上拉加载，不需要置空数组
    if(!isLoadMore){
      this.setData({
        allTabList:[], // 全部       
        pageNo: 1
      });
    }
    let opt = {
      pageNo :this.data.pageNo,
      token:this.getStorage('user_info').wx_openid,
      orderType:this.data.orderType,
      status:this.data.currentTab
    }
    
    this._requestPageListCom("virtualTaskList", opt, callback);
  },
  // 列表接口
  _requestPageListCom(url, params, callback) {    
    this.Shoplist(params).then(res => {      
      if (res.resCode == "9999") {       
        let oldList = [];     
        oldList = this.data.allTabList;
        const newGoodsList = res.data.list
        const allData = [...oldList, ...newGoodsList]
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
  // 详情
  goDetails:function(events){
    //console.log(events)
    let orderId = events.currentTarget.dataset.orderid;
    this.router("/pagesUser/shopOrder/goDetails/index?orderId="+orderId)
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

  //确认消费
  payok(events){
    let orderid=events.currentTarget.dataset.orderid;
    let that = this;
    this.$showModal({content: '您确定用户消费了嘛？',title:'提示'}).then(res=>{
      if(res.confirm){

        let obj_data={
          token:this.getStorage('user_info').wx_openid,
          order_id:events.currentTarget.dataset.orderid
        }
        this.orderReceipt(obj_data).then(res=>{
          this.$showToast(res.resMessage) 
          setTimeout(()=>{
            that.setData({
              currentTab:2,
              orderType:1,
              allTabList:[]
            })
            that._requestPageList(true);
          },3000)          
        })




      }


    })

    
    console.log(orderid)
  }
  
})