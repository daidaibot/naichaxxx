import QRCode from "../../../utils/weapp-qrcode.js" //引入生成二维码的插件
let app = getApp();
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
      orderId:'',  
      order_list:{},    
      shopInfo:{},
        
    },
    onLoad: function (options) {
      this.setData({
        orderId:options.orderId
      })
      this.reateQrcode()
      // setTimeout(()=>{
      //   this.selectComponent("#page").hideLoading()
      // },2000)
    },


    reateQrcode() {

      var that = this;
      new QRCode('myQrcode', {
        text:this.data.api_url+'?type=1&orderId='+this.data.orderId,
        width: that.createRpx2px(400),
        height: that.createRpx2px(400),
        padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
        correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
        callback: (res) => {
          // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
          that.data.qrcodePath = res.path;
        }
      })
    },
     //用户二维码保存到本地相册
     saveQrcode: function () {
      var that = this;
      wx.getImageInfo({
        src: that.data.qrcodePath,
        success: function (ret) {
          var path = ret.path;
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success(result) {
              if (result.errMsg === 'saveImageToPhotosAlbum:ok') {
                wx.showToast({
                  title: '保存成功',
                })
              }
            }
          })
        }
      })
    },
    createRpx2px(rpx) {
      return wx.getSystemInfoSync().windowWidth / 750 * rpx
    },
    onShow(){
      let that=this     
      let obj_data={
        token:this.getStorage('user_info').wx_openid,
        order_id:this.data.orderId
      }      
      this.orderInfo(obj_data).then(res=>{               
        if(res.resCode=="9999"){
          that.setData({
            order_list:res.data
          })
        }else{
          wx.showToast({title:res.resMessage,icon:"none"})
        }
      })     
    },
    
})