// component/specs/index.js
let app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    mainColor: {
      type: String,
      default: ''
    },
    subColor: {
      type: String,
      default: ''
    }
  },
  data: {
    ...app.globalData.config,
    couponList:[],   
    scrollTop: 0, // 设置竖向滚动条位置
    triggered: false,    
  },
  attached(){
    // this.showSpecs()
  },
  methods: {
    ...app.globalData.function,
    showSpecs(couponList){
      this.setData({
        couponList:couponList
      })
      this.selectComponent("#popup").show()
    },
    hideSpecs(){     
      this.selectComponent("#popup").hide()
    },
    draw_coupon(events){
      let storageData = this.getStorage('user_info')
      let that=this
      let obj_data={
        token:storageData.wx_openid,
        couponId:events.currentTarget.dataset.couponid,
      }

      this.drawCoupon(obj_data).then(res=>{          
        if(res.resCode=="9999"){
          wx.showToast({title: res.resMessage,icon:"none"})
        }else{
          wx.showToast({title: res.resMessage,icon:"none"})
        } 
        this.selectComponent("#popup").hide()         
      })


    },
    // 下拉刷新接口
    onAllRefresh() {   
      console.log(12)  
      this.setData({
        triggered: false
      })    
    },

    allLoadMore(e){
      console.log(11)
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
    allLoadMore(){
      console.log(11)
    },
    pScrollTo(){
      // 返回顶部
      this.setData({
        scrollTop:0
      });
    },
    changeTab(){
      console.log(12)
    },
    

    
   
  }
})
