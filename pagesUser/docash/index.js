const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    loading: false,
    cash_info:[],
    money:'',
    realname:'',
    idCard:'',
    bankname:'',
    bank_num:'',
    bank_address:'',
    phone:'',
    cashType:'storage',
  },

  onShow(){
    let userInfo=this.getStorage('user_info')
    // if(userInfo.is_type !=1){
    //   this.$showToast('您无权操作！')
    //   setTimeout(()=>{
    //     wx.navigateBack({
    //       delta: 1, // 返回上一级页面。
    //       success: function() {
    //           console.log('成功！')
    //       }
    //     })
    //   },1000)
    // }
  },

  onLoad:function(options){
    if(options.cashType){
      this.setData({
        cashType:options.cashType
      })
    }
     this.get_cash_limit()

  },

  get_cash_limit(){
   let obj_data={
     type:this.data.cashType,
    token:this.getStorage('user_info').wx_openid,
   }
   this.cash_limit(obj_data).then(res=>{
     if(res.resCode=="9999"){
       this.setData({
        cash_info:res.data
       })
     }     
   })
  },

  formSubmit: function (e) {
    let _that = this;
    let money = e.detail.value.money;
    let realname = e.detail.value.realname;
    let idCard = e.detail.value.idCard;
    let bankname = e.detail.value.bankname;
    let bank_num = e.detail.value.bank_num;
    let bank_address = e.detail.value.bank_address;
    let phone = e.detail.value.phone;


    let regPhone = /^1[3578]\d{9}$/;
    let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
    if (money == "") {
      wx.showModal({
        title: '提示',
        content: '请输入提现金额!',
      })
      return false
    }

    if(money< this.data.cash_info.min_money){
      wx.showModal({
        title: '提示',
        content: '提现金额大于'+this.data.cash_info.min_money+'!',
      })
      return false
    }
    if (realname == "") {
      wx.showModal({
        title: '提示',
        content: '请输入真实姓名!',
      })
      return false
    }

    if (idCard == "") {
      wx.showModal({
        title: '提示',
        content: '请输入身份证号码!',
      })
      return false
    }

    if (bankname == "") {
      wx.showModal({
        title: '提示',
        content: '请输入银行卡名称!',
      })
      return false
    }


    if (bank_num == "") {
      wx.showModal({
        title: '提示',
        content: '请输入银行卡卡号!',
      })
      return false
    }

    if (bank_address == "") {
      wx.showModal({
        title: '提示',
        content: '请输入“ⅩⅩ银行ⅩⅩ市ⅩⅩ支行!',
      })
      return false
    }

    if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号!',
      })
      return false
    }    
    this.setData({
      loading: true
    })
    let status = false;
    let obj_data={
      token:this.getStorage('user_info').wx_openid,
      money:money,
      realname:realname,
      idCard:idCard,
      bankname:bankname,
      bank_num:bank_num,
      bank_address:bank_address,
      phone:phone,
      type:this.data.cashType,
    }
    this.Pdocash(obj_data).then(res=>{
      if(res.resCode=='9999'){
        this.$showToast("操作成功，等待管理员审核！")
        setTimeout(function () {
          //要延时执行的代码
            wx.navigateTo({
              url: '/pagesUser/docash/docash_log/index?cashType='+_that.data.cashType,
              success: function (e) {
                let page = getCurrentPages().pop();
                page.onShow();
              }
           })
        }, 2000) //延迟时间
      }else{
        this.$showToast(res.resMessage)
      }
      this.setData({
        loading: false
      })


    })
  
   
    
  },
})