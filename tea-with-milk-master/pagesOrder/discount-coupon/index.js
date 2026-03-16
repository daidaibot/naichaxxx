
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    couponList:[
    ],
    discountPrice: 0,
    discountId:0,
    flag: null, 
  },
  onLoad(options){
    console.log(options)
    let flag = options.flag;
    let discountId = options.discountId;
    let discountPrice = options.discountPrice;
    let couponList=JSON.parse(options.coupon_list)
   
    couponList.forEach((ele,index) =>{
      if(+discountId === ele.id){
        ele.checked = !ele.checked;
        ele.checked ? discountPrice = ele.amount : null;
        ele.checked ? discountId = ele.id : null;
      }
      if(+discountId !== ele.id){
        ele.checked = false;
      }
    })

    this.setData({flag,couponList,discountPrice,discountId})
    wx.setNavigationBarTitle({
      title: flag == 1 ? '选择优惠券' : '礼券中心',
    })
  },

  checkChange(e){
      let couponList = this.data.couponList;   
      let discountPrice = e.currentTarget.dataset.item.amount;
      let discountId = e.currentTarget.dataset.item.id;
    
      couponList.forEach((ele,index) =>{
        if(index === e.target.dataset.index){
          ele.checked = !ele.checked;
          ele.checked ? discountPrice = ele.amount : null;
          ele.checked ? discountId = ele.id : null;
        }
        if(index !== e.target.dataset.index){
          ele.checked = false;
        }
      })
      
      let is_check=0
      couponList.forEach((ele,index) =>{
         if(ele.checked) is_check=1
      })
      if(is_check==1){
        this.setData({
          discountPrice,
          discountId,
        })
      }else{
        this.setData({
          discountPrice:0,
          discountId:0,
        })
      }
      this.setData({couponList})

  },



  confirm(){
     const prevPage = this.$page(-1);
     const discountPrice = this.data.discountPrice;
     const discountId = this.data.discountId;
     prevPage.setData({discountPrice,discountId})
     prevPage.computedData();
     this.back();
  }

})