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
    addresslist:[],    
    type:1,
    triggered: false,
    
  },
  attached(){
    // this.showSpecs()
  },
  methods: {
    ...app.globalData.function,
    showSpecs(addresslist,type='1'){
     
      this.setData({
        addresslist:addresslist.list,
        type:type
      })
      console.log(this.data.addresslist)
      // console.log(type)
      this.selectComponent("#popup").show()
    },
    hideSpecs(){
      console.log("ok")
      this.selectComponent("#popup").hide()
    },
    handleOperate(event){    
      let addressId=event.currentTarget.dataset.item.id
      this.triggerEvent('change', addressId);
      //this.selectComponent("#popup").hide()   
    }

    
     
      

  }
})
