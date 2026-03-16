// pages/mine/notice/index.js

const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    noticeList: [],
    searchForm:{
      noticeTitle: null
    }
  },

 
  detail(e){
    const item = e.currentTarget.dataset.item
    this.setStorage('notice', item)
    this.router("/pagesUser/notice/detail/index")
  },
  onLoad(){
      this.getNotice().then(res=>{
         if(res.resCode=="9999"){
           this.setData({
            noticeList:res.data.list
           })
         }
      })
  }

})