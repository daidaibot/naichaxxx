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
    goodsSpec:[],
    num:1,
  },
  attached(){
    // this.showSpecs()
  },
  son_method(data){
    console.log(data);
  },

  methods: {
    ...app.globalData.function,
    numChange(e){
        let stock=this.data.goodsSpec.check_attr.stock
        if(stock<e.detail.value){
          wx.showToast({
            title: "库存不足！",
            icon:"none"
          })
        }else{
          this.setData({
            num:e.detail.value
          }) 
        }              
    },
    showSpecs(spec,token){
      let spec_name=''
      for (let i = 0; i < spec.goodsSpecParam.length; i++) {
        spec_name+=spec.goodsSpecParam[i].name+":"
        for (let j = 0; j < spec.goodsSpecParam[i].list.length; j++) {
          if(spec.goodsSpecParam[i].list[j].checked){
            spec_name+=spec.goodsSpecParam[i].list[j].name+','
          }          
        }
      }
      spec_name=spec_name.slice(0,-1)   
      spec['check_attr']=spec.goodsSpecList[spec_name]      
      this.setData({
        goodsSpec:spec,
        token:token,
        num:1,
      })
      this.selectComponent("#popup").show()
    },
    hideSpecs(){
      this.selectComponent("#popup").hide()
    },
    //选择属性
    clickSkuValue(event){
      let that = this;
      let specName = event.currentTarget.dataset.value;
      let item_value = event.currentTarget.dataset.item_value;      
      let spec=that.data.goodsSpec
      for (let i = 0; i < spec.goodsSpecParam.length; i++) {        
        if(item_value == spec.goodsSpecParam[i].name){
          for (let j = 0; j < spec.goodsSpecParam[i].list.length; j++) {
            if(spec.goodsSpecParam[i].list[j].name==specName){
              spec.goodsSpecParam[i].list[j].checked=1
            }else{
              spec.goodsSpecParam[i].list[j].checked=0
            }          
          }
        }        
      }


      let spec_name=''
      for (let i = 0; i < spec.goodsSpecParam.length; i++) {
        spec_name+=spec.goodsSpecParam[i].name+":"
        for (let j = 0; j < spec.goodsSpecParam[i].list.length; j++) {
          if(spec.goodsSpecParam[i].list[j].checked){
            spec_name+=spec.goodsSpecParam[i].list[j].name+','
          }          
        }
      }
      spec_name=spec_name.slice(0,-1)   
      spec['check_attr']=spec.goodsSpecList[spec_name]      
      this.setData({
        goodsSpec:spec
      })
    },
    //立即购买
    order_car(){
      let that=this
      let goods= this.data.goodsSpec;
      let storageData = this.getStorage('user_info');
      let car={
        goodsId:goods.id,
        specId:goods.check_attr.id,
        number:this.data.num,
        token:storageData.wx_openid
      }
      let goodsId=car.goodsId
      this.goodsCar(car).then(res => {
        
        if(res.resCode=="9999"){
          wx.showToast({title:res.resMessage,icon: 'none'})
          that.selectComponent("#popup").hide()
          that.triggerEvent("specs_pay", {car_total:res.data.car_total,setting_money:res.data.car_money_total,goodsId:goodsId,goods_number:res.data.goods_number})
        }else{
          wx.showToast({title:res.resMessage,icon: 'none'})        
        }
      })
    },
    //加入购物车
    order_pay(){
      let that=this
      let goods= this.data.goodsSpec;
      let storageData = this.getStorage('user_info');
      let car={
        goodsId:goods.id,
        specId:goods.check_attr.id,
        number:this.data.num,
        token:storageData.wx_openid
      }
      this.setStorage('shop_type', 'quick');
      let  cardata = JSON.stringify(car)   
      this.router("/pagesOrder/confirm/index?value="+cardata)
       
    }
  } 
})
