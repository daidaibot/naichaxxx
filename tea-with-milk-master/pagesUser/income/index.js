// pagesMine/address/list/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,    
    currentTab:1,
    incrome:[],
    money:0.00,
    order:0,
    total:0.00
  },

  onLoad(){
    this.gat_income()    
    setTimeout(()=>{
      this.selectComponent("#page").hideLoading()
      this.get_total()
    },1000)
  },
   // 点击标题切换当前页时改变样式
   changeNav: function (e) {
    let currentIndex = e.target.dataset.current;
    if (this.data.currentTab == currentIndex) {      
      return false;
    } else {
      this.setData({
        pageNo:1,
        currentTab: currentIndex
      })
    }
     this.get_total();
    
  },

  //获取效果数量
  get_total(){
    let money
    let order
    let total
    let currentIndex=this.data.currentTab
    // console.log(currentIndex)
    // console.log(this.data.incrome)
    if(currentIndex==0){
      money=this.data.incrome.last_day.money
      order=this.data.incrome.last_day.order
      total=this.data.incrome.last_day.ok_money
    }
    if(currentIndex==1){
      money=this.data.incrome.one_day.money
      order=this.data.incrome.one_day.order
      total=this.data.incrome.one_day.ok_money
    }
    if(currentIndex==2){
      money=this.data.incrome.seven_day.money
      order=this.data.incrome.seven_day.order
      total=this.data.incrome.seven_day.ok_money
    }
    if(currentIndex==3){
      money=this.data.incrome.thirty_day.money
      order=this.data.incrome.thirty_day.order
      total=this.data.incrome.thirty_day.ok_money
    }
    
    this.setData({
      money:money,
      order:order,
      total:total,
    });
  },
  
  //获取信息
  gat_income(){
    let obj_data={
      token:this.getStorage('user_info').wx_openid
    }
    this.getUserIncome(obj_data).then(res=>{
        if(res.resCode=='9999'){
          this.setData({
            incrome:res.data
          })
        }
    })
  }

})