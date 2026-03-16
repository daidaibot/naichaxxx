// pagesMine/address/list/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,    
    currentTab:1,
    incrome:[],
    allTabList:[],
    money:0.00,
    order:0,
    total:0.00,
    userInfo:{}
  },


  onShow(){
    this._requestPageList()
  },

  onLoad(){
    this.gat_income()    

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


      //this._requestPageList()

      
    // setTimeout(()=>{
    //   this.selectComponent("#page").hideLoading()
    //   this.get_total()
    // },1000)
  },
   

  
  //获取信息
  gat_income(){
    let that=this
    let jsonData={
      token:this.getStorage('user_info').wx_openid
    }
    this.getUser(jsonData).then(res => {                        
      if(res.resCode=='9999'){
        // console.log(res.data);
        that.setStorage('user_info', res.data);
        that.setData({
          userInfo:res.data
        })
      }
    })
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
      }
      
      this._requestPageListCom("virtualTaskList", opt, callback);
    },
    // 列表接口
    _requestPageListCom(url, params, callback) {    
      this.pointsList(params).then(res => {  
        
        if (res.resCode == "9999") {       
          let oldList = [];     
          oldList = this.data.allTabList;
          const newGoodsList = res.data.lists
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

  handleChangeGoods(options){
    let pointId=options.currentTarget.dataset.posid
    console.log('1',options)
    let url="/pagesUser/points/detail/index?pointId="+pointId
    this.router(url)
  },

  //购物车列表信息 
  buyorder(e){  
    let item=e.currentTarget.dataset.item
    let points=this.data.userInfo.points
    if(item.goods_points>points){
      this.$showToast('积分不足！')
      return false
    }
    this.selectComponent("#buyorder").showSpecs(item)    
  },




})