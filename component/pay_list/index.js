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
    carlist:[],    
    type:1,
    triggered: false,
    
  },
  attached(){
    // this.showSpecs()
  },
  methods: {
    ...app.globalData.function,
    showSpecs(carlist,type='1'){
      this.setData({
        carlist:carlist.list,
        type:type
      })
      // console.log(type)
      this.selectComponent("#popup").show()
    },
    hideSpecs(){
      console.log("ok")
      this.selectComponent("#popup").hide()
    },
    confirm(){
      if(this.data.type==1){
        this.setStorage('shop_type', 'carts');      
        this.router("/pagesOrder/confirm/index")
      }else if(this.data.type==2){  
        this.router("/pagesOrder/dispatch/index")
      }      
    },
    // 下拉刷新接口
    onAllRefresh() {     
      this.setData({
        triggered: false
      })    
    },

    //获取数量
    bindInputNumber(e){
        let num = 1
        let shoppingCartList = this.data.carlist
        const index = e.currentTarget.dataset.carid
        let type=e.detail.type
        let storageData = this.getStorage('user_info')
        let that=this

        let obj_data={
          token:storageData.wx_openid,
          carId:index,
          number:num,
          type:type=='plus'?"1":"2",
        }
        this.caredit(obj_data).then(res=>{          
          if(res.resCode=="9999"){
            this.setData({
              carlist:res.data.list
            })
            if(res.data.list.length<=0){
              that.selectComponent("#popup").hide()
              that.triggerEvent('echange', {});
            }
            this.triggerEvent('caredit',{})
          }else{
            wx.showToast({title: res.resMessage,icon:"none"})
          }          
        })
        // if(num===0){
        //   this.$showModal({content: '确定要删除此商品？'}).then(res=>{
        //     if(res.confirm){
              
        //       console.log("确认删除")
        //     }else{
             
        //       // console.log("取消删除")
        //     }
        //   })
        // }
        //console.log('ok',shoppingCartList,Object.keys(shoppingCartList).length)
        
        // for(var i in shoppingCartList){      
        //   for(var j=0;j<shoppingCartList[i].list.length;j++){            
        //     if(shoppingCartList[i].list[j].id==index){             
        //       shoppingCartList[i].list[j].goods_number=num 
        //     }           
        //   }
        // }
        // this.setData({
        //   carlist:shoppingCartList
        // })
    },
    //清空购物车
    delcar(){        
      let storageData = this.getStorage('user_info')
      let that=this
      let obj_data={
        token:storageData.wx_openid          
      }

      this.cardel(obj_data).then(res=>{
        wx.showToast({title: res.resMessage,icon:"none"})
        that.selectComponent("#popup").hide()
        that.triggerEvent('echange', {});
      })
     
      

    }  
  }
})
