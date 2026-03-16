const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    loading: false,
    contact: '',
    contant: ''
  },
 
  formSubmit: function (e) {
    let _that = this;
    let content = e.detail.value.opinion;
    let contact = e.detail.value.contact;
    let regPhone = /^1[3578]\d{9}$/;
    let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容不能为空!',
      })
      return false
    }
    if (contact == "") {
      wx.showModal({
        title: '提示',
        content: '手机号或者邮箱不能为空!',
      })
      return false
    }
    if(contact == "" && content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容,手机号或者邮箱不能为空!',
      })
      return false
    }
    if ((!regPhone.test(contact) && !regEmail.test(contact)) || (regPhone.test(contact) && regEmail.test(contact))) { //验证手机号或者邮箱的其中一个对
      wx.showModal({
        title: '提示',
        content: '您输入的手机号或者邮箱有误!',
      })
      return false
    } else {
      this.setData({
        loading: true
      })

      var n = wx.getStorageSync("userinfo");

      let nickname;
    
      //当本地缓存的用户名称不为""或者null时，设置userinfo信息
      if(n.nickName != '' && n.nickName != null){
          nickname = n.nickName;
      }
    let status = false;
    console.log(this.dev)
      wx.request({
        url: this.data.dev.url+"/user/add_feedback",
        method: 'POST',
        data: {
          "content": content,  
          "contact": contact,
          "token": this.getStorage('user_info').wx_openid,
          "type":2
        },
        success: function (res) {
          console.log(res)
          if (res.data.resCode == "9999") {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 1000,
              success: function (res) {
                //提示框消失后返回上一级页面
                setTimeout(() => {
                    wx.navigateBack({
                      change: true,
                    })
                }, 1200)
             }
           })
          }else{
            wx.showToast({
                title: '操作失败，请稍后再试',
                icon: 'error',
                duration: 1200
              });
          }
        },
        fail: function () {
            wx.showToast({
                title: '请求失败~',
                icon: 'error',
                duration: 1500
            })
        }
      })
      return status;
    }
  },
})