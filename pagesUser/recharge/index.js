// pages/recharge/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    list:[],
    docashId:"0",
    docashType:"1",
    value:"",
    value2:"",
    loading:false,
    balance:0,
  },

 //生命周期函数--监听页面加载
  onLoad(options) {
   
  },


  onShow(){
    this.docash()
  },

  //获取充值信息
  docash(){
    let that=this
    let userInfo=this.getStorage('user_info')
    this.docashList({token:userInfo.wx_openid}).then(res=>{
     if(res.resCode=="9999"){      
      that.setData({
        list:res.data.data, 
        balance:res.data.balance,     
        docashId:res.data.data[0].id,
        value:res.data.data[0].money
       })
     }
    })
  },
  //获取点击信息
  cash(event){
    this.setData({
      docashType:event.currentTarget.dataset.id=="21"?"2":"1",
      docashId:event.currentTarget.dataset.id,   
    })
  },
  dosubmit(){
    this.setData({loading:true})
    let that=this
    
    let obj_data={
      token:this.getStorage("user_info").wx_openid,
      type:this.data.docashType,
      docashId:this.data.docashId,
      value2:this.data.value2,      
    }
    if(this.data.docashType ==2 && !obj_data.value2){
      this.$showToast("请输入金额！")
      that.setData({loading:false})
      return
    } 
   
    this.dorecharge(obj_data).then(rest=>{
      if(rest.resCode=="9999"){
        let res = rest.data
        that.setData({loading:false})
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
                    wx.navigateTo({
                      url: '/pages/moneylog/index',
                      success: function (e) {
                        let page = getCurrentPages().pop();
                        if (page == undefined || page == null) return;
                              page.onShow();
                      }
                   })
                }, 1500) //延迟时间
              }
            })
          },
          fail: res => {
            that.setData({loading:false})
            // 支付失败，展示支付失败提示
            wx.showToast({
              title: '支付失败',
              icon: 'error',
              
            })
          }
        })            
      }else{
        wx.showToast({title:rest.resMessage,icon:"none"})
      }
  })
   
  },
  // input输入中
getInputNum (e) {
	let amount = e.detail.value
    let num = null
    // 小数点后最多只能输入两位
    num = amount.replace(new RegExp('^(\\d+\\.\\d{2}).+'), '$1')
   

    // 小数点开头得话，让前面加个0   eg: 0.xx
    const startPoint = /^\./g
    if (startPoint.test(num)) {
      num = amount.replace(startPoint, '0.')
    }

    // 若没有小数点，前面输入多个0，去掉0取整
    // if（num有值 && 没有小数点 && 不等于'0'）
    if (num && !num.includes('.') && num !== '0') {
      num = +num
    }
    // 若出现多个小数点，则替换为1个
    const morePoint = /\.+(\d*|\.+)\./g
    if (morePoint.test(num)) {
      num = amount
        .replace(/\.{2,}/g, ".")
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
    }
	this.setData({
		value2: num
	})
}


 
})