// 导入
import {
  toBarcode,
  toQrcode
} from '../../utils/qrcode/utils.js';
const app = getApp()
Page({ 
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    code: '11223344556', // 需要转成二维码的字符
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      // 生成二维码和条形码。 这里可以是发起后台请求，拿到要转的字符再调用方法来转二维码和条形码
      setTimeout(function () {
       
      }, 200)
  },

  
  onShow() {
     //登陆信息
    var storageData = this.getStorage('user_info');
    console.log("storageData.wx_openid",storageData.wx_openid)
    if(storageData.wx_openid==undefined){   
      this.router("/pages/login/index")
    }else{      
      this.setData({
        userInfo:storageData
      }) 
    } 
    
    this.getUserInfo()
  },

  Refresh(){
    this.getUserInfo()
  },
  getUserInfo(){
    var storageData = this.getStorage('user_info');
    var that=this;    
    var jsonData = {
      token:storageData.wx_openid
    };                    
    that.getUser(jsonData).then(res => {                        
      if(res.resCode=='9999'){          
        toBarcode('barcode', res.data.member_code+Math.floor(Math.random() * 100) + 1, 320, 60);
        toQrcode('qrcode', res.data.scan_url, 220, 220);
        that.setStorage('user_info', res.data);
        that.setData({
          userInfo:res.data
        })
      }
    })
},


})