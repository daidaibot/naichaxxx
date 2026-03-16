// pages/discover/index.js
import QRCode from "../../utils/weapp-qrcode.js" //引入生成二维码的插件
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    tabList: [
      {name: '分享', key: 1},
      {name: '故事', key: 0}
    ],
    current: 1,
    newlist:[],
    cardCur: 0,
    bannner_list:[],
    winHeight:''
  },
  handleChange({ detail }){
    this.setData({
      current: detail.key
    })
    this.getNewInfo()
  },
  onLoad(){

     // 计算drawer高度，占满window
     let that = this;
     //  高度自适应
     wx.getSystemInfo({
       success: function (res) {
         let clientHeight = res.windowHeight,
           clientWidth = res.windowWidth,
           rpxR = 750 / clientWidth;
         let calc = (clientHeight - 50 - 54) * rpxR - 260;
         that.setData({
          //  windowHeight:  res.windowHeight,
          //  windowWidth:  res.windowWidth,
           winHeight: calc
         });
       }
      })

      this.reateQrcode()
    setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
    },2000)
    this.getNewInfo()
  },

  detail(events){
      // console.log(events.currentTarget.dataset.id)
      this.router('/pages/discover/detail/index?id='+events.currentTarget.dataset.id)
  },

   getNewInfo(){
     let obj_data={
       recom:this.data.current
     }
     this.NewList(obj_data).then(res=>{
        if(res.resCode=='9999'){
          this.setData({
            newlist:res.data.data,
            bannner_list:res.data.bannner_list
          })
        }
     })
   },
   cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },



  share(){
    this.$showLoading("图片生成中~")
    let swiperList=this.data.bannner_list
    let cardCur = this.data.cardCur
    let id= swiperList[cardCur].id
    var that = this;
    let dataJson={
      id,
      token:this.getStorage('user_info').wx_openid
    }
    this.shopPoster(dataJson).then(res=>{
       if(res.resCode=='9999'){
          wx.getImageInfo({
              src: res.data.url,
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
       }
       this.$hideLoading()
    })
  },
  

  reateQrcode() {

    var that = this;
    new QRCode('myQrcode', {
      text:this.data.api_url+'?order=1&memberId=1',
      width: that.createRpx2px(200),
      height: that.createRpx2px(200),
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
        that.data.qrcodePath = res.path;
      }
    })
  },

  createRpx2px(rpx) {
    return wx.getSystemInfoSync().windowWidth / 750 * rpx
  },


})