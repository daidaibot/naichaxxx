
let app = getApp();
Page({
  ...app.globalData.function,
    data: {
      ...app.globalData.config,
        selectDate: "",
        machineShow: false,      
        shopInfo:{},
        comfirmInfo:[],
        shoppingCartList: [],
        remark:"",
        quick_info:{},
        total_money:'0.00',
        allMoney:"0.00",
        discountPrice:0.00,
        discountId:'',
        orderType:2,
        current: 1,
        addressId:'',
        info:{
          1:{
            name:'黄先生',
            phone: 183968000,
            address:'福建省厦门市思明区湖滨南路227号之7号（屋后茶山香苑）'
          },
        },
        
    },
    onLoad: function (options) {
      
      if(options.value){
        this.setData({
          quick_info:options.value
        })
      }  

      if(options.orderType){
        this.setData({
          orderType:options.orderType
        })
      }

     

      this.getConfirm()
      this.picker = this.selectComponent("#picker")
      setTimeout(()=>{
        this.selectComponent("#page").hideLoading()
      },2000)


    },
    timeOpen() {
      this.picker.showDialog(this.data.comfirmInfo.start_time,this.data.comfirmInfo.end_time);
    },
    confirm(e) {
        this.setData({
            selectDate: e.detail.selectDate
        })
    },
    onChangeremark(event){    
      this.data.remark = event.detail
    },

    changeOrder(events){
      this.setData({
        orderType:events.currentTarget.dataset.ordertype
      })       
      if(this.data.orderType==1){
        this.setData({
          total_money:this.data.allMoney
        })
      }else if(this.data.orderType==2){
        this.setData({
          total_money:Number(this.data.allMoney) + Number(this.data.comfirmInfo.freight_price)
        })
      }



    },

      // 计算价格
  computedData(){  
    let totalMoeny=this.data.comfirmInfo.allMoney-this.data.discountPrice 
    console.log('totalMoeny',totalMoeny)
    this.setData({
      total_money:totalMoeny
    })
  },
    wxconfirm(){
      let shop_type= this.getStorage('shop_type') 
      let obj_data={
        token:this.getStorage('user_info').wx_openid,
        type:shop_type,
        // selectDate:this.data.selectDate,
        remark:this.data.remark,
        storageId:this.getStorage("shopInfo").storageId,
        redId:this.data.discountId,
        orderType:this.data.orderType,
      
      }
      if(obj_data.orderType==1){        
        obj_data.addId=0
        obj_data.freight_price=0
      }else{
        obj_data.selectDate=this.data.selectDate
        if(this.data.selectDate.length==0){
          wx.showToast({title:"请选择时间！",icon:"none"})
          return
        } 
        if(!this.data.comfirmInfo.address.id){
          wx.showToast({title:"请选择收货地址！",icon:"none"})
          return
        }
        obj_data.addId=this.data.comfirmInfo.address.id
        obj_data.freight_price=this.data.shoppingCartList.freight_price
        obj_data.price_token=this.data.shoppingCartList.price_token
        obj_data.price_total_money=this.data.shoppingCartList.price_total_money,
        obj_data.distance=this.data.shoppingCartList.distance
      }
      // console.log(obj_data);
      // return
        
      if(shop_type=='carts'){ //购物车信息 
        this.orderSubmit(obj_data).then(res=>{
          if(res.resCode=="9999"){
            this.router("/pagesOrder/wxPay/index?order_no="+res.data.order_no+"&goods_total="+res.data.goods_total+"&orderpay=1")
          }else{
            wx.showToast({title:res.resMessage,icon:"none"})
          }
        })
      }else{
        obj_data.goodsInfo=this.data.quick_info
        this.orderSubmit(obj_data).then(res=>{
          if(res.resCode=="9999"){
            this.router("/pagesOrder/wxPay/index?order_no="+res.data.order_no+"&goods_total="+res.data.goods_total+"&orderpay=1")
          }else{
            wx.showToast({title:res.resMessage,icon:"none"})
          }
        })
      }



    },
    getConfirm(){     
      let that=this
      this.setData({
        shopInfo:this.getStorage('shopInfo')
      })
      let obj_data={
        discountId:this.data.discountId,
        token:this.getStorage('user_info').wx_openid,
        storageId:this.getStorage("shopInfo").storageId,
        addressId:this.data.addressId,
      }
      let shop_type= this.getStorage('shop_type')      
      if(shop_type=='carts'){ //购物车信息
        this.previewcar(obj_data).then(res=>{          
          if(res.resCode=="9999"){
            that.setData({
              comfirmInfo:res.data,   
              selectDate:res.data.selectDate,          
              shoppingCartList:res.data.show[0],
              allMoney:res.data.allMoney,
              total_money:res.data.allMoney,
            })

            if(this.data.orderType==1){
              this.setData({
                total_money:this.data.allMoney
              })
            }else if(this.data.orderType==2){
              this.setData({
                total_money:Number(this.data.allMoney) + Number(this.data.comfirmInfo.freight_price)
              })
            }
            
          }else{
            wx.showToast({title:res.resMessage,icon:"none"})
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1, // 返回上一级页面。
                success: function() {
                    console.log('成功！')
                }
              })
            },2000)
          }
        })
      }else{
        //立即购买 quick
        let obj_data={
          token:this.getStorage('user_info').wx_openid,
          discountId:this.data.discountId,
          storageId:this.getStorage("shopInfo").storageId,
          goodsInfo:(this.data.quick_info),
          addressId:this.data.addressId,
        }
        this.preView(obj_data).then(res=>{
          if(res.resCode=="9999"){
            that.setData({
              comfirmInfo:res.data, 
              selectDate:res.data.selectDate, 
              allMoney:res.data.allMoney,         
              shoppingCartList:res.data,
              total_money:res.data.allMoney,
            })

            if(this.data.orderType==1){
              this.setData({
                total_money:this.data.allMoney
              })
            }else if(this.data.orderType==2){
              this.setData({
                total_money:Number(this.data.allMoney) + Number(this.data.comfirmInfo.freight_price)
              })
            }
          }else{
            wx.showToast({title:res.resMessage,icon:"none"})
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1, // 返回上一级页面。
                success: function() {
                    console.log('成功！')
                }
              })
            },2000)
          }
        })
      }   
    },

    // 优惠券跳转
    routeToCoupon(){
      let discountId=this.data.discountId
      let discountPrice=this.data.discountPrice
      let coupon_list=JSON.stringify(this.data.shoppingCartList.coupon_list)
      console.log(this.data.shoppingCartList)
      wx.navigateTo({
        url: "/pagesOrder/discount-coupon/index?flag=1&discountId="+discountId+"&discountPrice="+discountPrice+"&coupon_list="+coupon_list,
      })
    },
    //下拉刷新
  onPullDownRefresh() {
    // // 停止下拉刷新效果
    // console.log('ok',11);
    this.onShow()
     wx.stopPullDownRefresh()     

   },
   onShow(){
     this.getConfirm()
   },
   routeToNext(){
    let that=this
    this.AddressList({token:this.getStorage('user_info').wx_openid}).then(res=>{
      if(res.resCode=='9999'){
        that.selectComponent("#address").showSpecs(res.data)        
      }
    })    
   },
   getAddessId(event){     
     this.setData({
      addressId:event.detail
     })
     this.selectComponent("#address").hideSpecs()  
     this.getConfirm()
   },

   //
   bindAddress(event){
     let url=event.currentTarget.dataset.url
     this.router(url)
      console.log(event)
   }
    
})