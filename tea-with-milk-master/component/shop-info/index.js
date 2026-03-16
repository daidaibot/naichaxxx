// component/specs/index.js
let app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    mainColor: {
      type: String,
      default: ''
    },
    subColor: {
      type: String,
      default: ''
    }
  },
  data: {
    ...app.globalData.config,
    shopInfo:"",   
    scrollTop: 0, // 设置竖向滚动条位置
    triggered: false,    
  },
  attached(){
    // this.showSpecs()
  },
  methods: {
    ...app.globalData.function,
    showSpecs(){
      let shopInfo = this.getStorage('shopInfo')
      console.log(shopInfo)
      this.setData({
        shopInfo:shopInfo
      })
      console.log("shopInfo",shopInfo)
      this.selectComponent("#popup").show()
    },
    hideSpecs(){     
      this.selectComponent("#popup").hide()
    },

  
  
    round_retain:function(num, n) {
        // num： 要处理的数  n： 保留位数
        // 十进制向右移动n为，而后利用 Math.round() 四舍五入，再向左移动n位，最后利用 toFixed() 保留小数
        return (Math.round(num * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);
    },
   openMap: function () {  
     let shopInfo=this.data.shopInfo  
     console.log('---',this.round_retain(shopInfo.lng,5))
     wx.openLocation({
      latitude: Number(this.round_retain(shopInfo.lng,5)), // 纬度，范围为-90~90，负数表示南纬
      longitude: Number(this.round_retain(shopInfo.lat,5)), // 经度，范围为-180~180，负数表示西经
      scale: 25, // 缩放比例
      name:shopInfo.storage_shop_name,
      address:shopInfo.province+shopInfo.city+shopInfo.area+shopInfo.address
     })     
    },

    tapMakePhoneCall:function(){
      let shopInfo=this.data.shopInfo  
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
  }
})
