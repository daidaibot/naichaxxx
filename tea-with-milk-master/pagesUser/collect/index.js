// pagesUser/collect/index.js
const app = getApp()
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    list:{},
    latitude:'',
    longitude:''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLocation();
    
  },

  getLocation(){
    var that=this;
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        var lat = res.latitude
        var lng = res.longitude
        that.setData({ latitude:lat, longitude: lng })  
        let jsonData={
          token:this.getStorage('user_info').wx_openid,
          lat:this.data.latitude,
          lng: this.data.longitude,
        }
        this.shopList(jsonData).then(res=>{
          if(res.resCode=='9999'){
            this.setData({
              list:res.data.list
            })        
          }
        })
         
      },
      fail: function() {
        wx.showToast({
          title: '重新进入小程序',
          icon:"none",
        })
      }
    })  
  },
  
  round_retain:function(num, n) {
    // num： 要处理的数  n： 保留位数
    // 十进制向右移动n为，而后利用 Math.round() 四舍五入，再向左移动n位，最后利用 toFixed() 保留小数
    return (Math.round(num * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);
},
openMap: function (options) {  
 let shopInfo=options.currentTarget.dataset.item

 wx.openLocation({
  latitude: Number(this.round_retain(shopInfo.lng,5)), // 纬度，范围为-90~90，负数表示南纬
  longitude: Number(this.round_retain(shopInfo.lat,5)), // 经度，范围为-180~180，负数表示西经
  scale: 25, // 缩放比例
  name:shopInfo.storage_shop_name,
  address:shopInfo.province+shopInfo.city+shopInfo.area+shopInfo.address
 })     
},

tapMakePhoneCall:function(options){
  let shopInfo=options.currentTarget.dataset.item
  wx.makePhoneCall({  
    phoneNumber: shopInfo.link_phone,          
    success: function(res){          
       console.log(res)          
    },        
    fail: function(err){          
       console.log(err)          
    }         
  })
} 

  
})