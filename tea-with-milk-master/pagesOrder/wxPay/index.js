// pagesOrder/wxPay/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    radio: '1',
    order_no:"",
    orderpay:1,
    goods_total:0,
  },

  
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  this.setData({
    order_no:options.order_no,
    goods_total:options.goods_total,
    orderpay:options.orderpay
  })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  onUnload: function () {
    /*关闭所有页，打开url指定页面*/
    wx.switchTab({
      url: '/pages/order/index'
    })
   
  },

  wxPay:function(){
    let orderpay=this.data.orderpay
    let that=this
    let obj_data={
      token:this.getStorage('user_info').wx_openid,
      pay_type:this.data.radio==1?"wechat":"account",
      pay_no:this.data.order_no
    }
    if(obj_data.pay_type=="wechat"){//立即支付订单      
      this.orderpay(obj_data).then(rest=>{
          if(rest.resCode=="9999"){
            let res = rest.data
            wx.requestPayment({
              timeStamp: res.timeStamp,
              nonceStr: res.nonceStr,
              package: res.package,
              signType: res.signType,
              paySign: res.paySign,
              success: res => {
                // 支付成功，跳转到下一个页面
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000,
                  //显示透明蒙层，防止触摸穿透
                  mask:true,
                  success: function () {
                    setTimeout(function () {
                      //要延时执行的代码
                        wx.switchTab({
                          url: '/pages/order/index',
                          // success: function (e) {
                          //   let page = getCurrentPages().pop();
                          //   page.onShow();
                          // }
                       })
                    }, 1500) //延迟时间
                  }
                })
              },
              fail: res => {
                // 支付失败，展示支付失败提示
                wx.showToast({
                  title: '支付失败',
                  icon: 'error',
                  duration: 2000,
                  //显示透明蒙层，防止触摸穿透
                  mask:true,
                  success: function () {
                    setTimeout(function () {
                      //要延时执行的代码
                        wx.switchTab({
                          url: '/pages/order/index',
                          // success: function (e) {
                          //   let page = getCurrentPages().pop();
                          //   page.onShow();
                          // }                         
                       })
                    }, 1500) //延迟时间
                  }
                })
              }
            })            
          }else{
            wx.showToast({title:rest.resMessage,icon:"none"})
          }
      })
    }else{
      this.orderpay(obj_data).then(rest=>{
        if(rest.resCode=="9999"){
          wx.showToast({
            title: '支付成功',
             icon: 'success',
            duration: 2000,
            //显示透明蒙层，防止触摸穿透
            mask:true,
            success: function () {
              setTimeout(function () {
                console.log("ok----ok")
                //要延时执行的代码
                  wx.switchTab({
                    url: '/pages/order/index',
                    // success: function (e) {
                    //   let page = getCurrentPages().pop();
                    //   page.onShow();
                    // }
                 })
              }, 1500) //延迟时间
            }
          })
        }else{
          wx.showToast({
            title: rest.resMessage,
             icon: 'error',
            duration: 2000,
            //显示透明蒙层，防止触摸穿透
            mask:true,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                  wx.switchTab({
                    url: '/pages/order/index',
                    // success: function (e) {
                    //   let page = getCurrentPages().pop();
                    //   page.onShow();
                    // }
                 })
              }, 1500) //延迟时间
            }
          })
        }
      })


    }    
  }  
})