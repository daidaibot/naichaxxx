// pagesMine/address/add-edit/index.js
// 部分省市区数据
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'N4XBZ-LSE3Z-YOHXB-ZMWQB-4WLPQ-OQFP4'//申请完成的密钥
});

const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    type: 'c',
    inputShow:false,
    boxShow:false,
    placeArray: [],
    province:[],
    city:[],
    area:[],
    pIndex: 0,
    cIndex: 0,
    aIndex: 0,
    check_index:1,
    check_addres:0,
    formData: {
      linkname: '',
      phone: '',
      address: ''
    },
    item:[],
    options:'',
    router:'',
    suggestion:[],
    suggestion_list:[]

  },
  handleOperate(){
    this.$showActionSheet(["编辑","删除"]).then(res=>{
      console.log(res)
    })
  },
  onLoad(e){   
    
    this.setData({type:e.type})
    if(e.item){
      let item=JSON.parse(e.item)
      console.log(item)
      this.areaList().then(res=>{
        if(res.resCode=="9999"){       
          this.setData({
            placeArray:res.data,
            formData:{
              linkname:item.realname,
              phone:item.phone,
              address:item.address
            },
            check_index:item.is_gender,
            check_addres:item.is_default?1:0,
            province:item.province,
            city:item.city,
            area:item.region,
            item:item
          })
        }
      })
    }else{
      this.areaList().then(res=>{
        if(res.resCode=="9999"){       
          this.setData({
            placeArray:res.data,
            province:res.data[0].name,
            city:res.data[0].city[0].name,
            area:res.data[0].city[0].area[0],
          })
        }     
      })
    }

    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    

    this.setData({
      options:prevPage.options,
      router:"/"+prevPage.route
    })

  },
   // 展示弹框
   getbox: function(){
    this.setData({
      boxShow: true
    })
  },
  // 隐藏弹框
  hidebox: function(){
    this.setData({
      boxShow: false
    })
  },
  // 确认按钮
  confirm: function(){
    this.setData({
      boxShow: false,
      inputShow: true,
    })
  },
 changeProvince2: function(e){
  const val = e.detail.value
  this.setData({
    pIndex: val,
    cIndex: 0,
    aIndex: 0,
    province: this.data.placeArray[val].name,
    city: this.data.placeArray[val].city[0].name,
    area: this.data.placeArray[val].city[0].area[0]
  })
},
changeCity2: function(e){
  const val = e.detail.value
  this.setData({
    cIndex: val,
    aIndex: 0,
    city: this.data.placeArray[this.data.pIndex].city[val].name,
    area: this.data.placeArray[this.data.pIndex].city[val].area[0]
  })
},
changeArea2: function(e){
  const val = e.detail.value
  this.setData({
    aIndex: val,
    area: this.data.placeArray[this.data.pIndex].city[this.data.cIndex].area[val]
  })
},
//信息提交
confirm_ok() {
  let that=this
  let formData = this.data.formData
  formData.is_gender=this.data.check_index
  formData.province=this.data.province
  formData.city=this.data.city
  formData.area=this.data.area
  formData.is_default=this.data.check_addres
   this.setData({loading:true})
  if(!formData.linkname){
    this.$showToast('请填写收货人信息！')
    return false
  }
  if(!formData.phone){
    this.$showToast('请填写联系方式信息！')
    return false
  }
  if(!formData.province || !formData.city || !formData.area){
    this.$showToast('请填写所在地区信息！')
    return false
  }
  if(!formData.address){
    this.$showToast('请填写详细地址信息！')
    return false
  }
  if(this.data.item.id){
    formData.id=this.data.item.id
  }
  formData.token=this.getStorage('user_info').wx_openid
  this.PostAddress(formData).then(res=>{
    this.setData({loading:false})
    if(res.resCode=='9999'){
        this.$showToast(res.resMessage)
        setTimeout(function () {
          //要延时执行的代码
          let router='/pagesUser/address/index'
          if(that.data.router && that.data.router=='/pagesOrder/confirm/index' ){

          
            router='/pagesOrder/confirm/index?value='+that.data.options.value+"&orderType=2"
         
            
          }
          wx.navigateTo({
              url: router,
              success: function (e) {
                let page = getCurrentPages().pop();
                page.onShow();
              }                         
           })
        }, 1500) //延迟时间
    }else{
      this.$showToast(res.resMessage)
      return false
    }
  })
  // console.log("提交中……",formData)

 
},
radioChange(e){
  console.log(e)
  this.setData({
    check_index:e.currentTarget.dataset.index
  })
},
is_def(e){
    let check_addres = this.data.check_addres
    if(check_addres==0){
     this.setData({
      check_addres:1
     })
    }else{
      this.setData({
        check_addres:0
       })
    }
}

,
//触发关键词输入提示事件
getsuggest: function(e) {
  var _this = this;
  console.log('---getsuggest---',e.detail.value)
  //调用关键词提示接口
  qqmapsdk.getSuggestion({
    //获取输入框值并设置keyword参数
    keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
    //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
    success: function(res) {//搜索成功后的回调
      console.log(res);
      var sug = [];
      var sug1 = [];
      for (var i = 0; i < res.data.length; i++) {
        sug.push({ // 获取返回结果，放到sug数组中
          title: res.data[i].title,
          id: res.data[i].id,
          addr: res.data[i].address,
          city: res.data[i].city,
          district: res.data[i].district,
          latitude: res.data[i].location.lat,
          longitude: res.data[i].location.lng
        });

        sug1.push( res.data[i].address)
      }
      _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
        suggestion: sug1,
        suggestion_list:sug
      });
    },
    fail: function(error) {
      console.error(error);
    },
    complete: function(res) {
      console.log(res);
    }
  });
}

})