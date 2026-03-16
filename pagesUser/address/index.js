// pagesMine/address/list/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    list:[]
  },
  handleOperate(e) {
    console.log(e)
    this.$showActionSheet(["编辑", "删除"]).then(res => {
      console.log(res)
      if (res.errMsg === "showActionSheet:ok") {
        if (res.tapIndex === 0) {
          this.handleEdit(e)
        }else{
          let item=e.currentTarget.dataset.item
          console.info("删除",item.id)
          this.Addressdel({token:this.getStorage('user_info').wx_openid,ids:item.id}).then(res=>{
              this.$showToast(res.resMessage)
              setTimeout(function () {
                //要延时执行的代码
                wx.navigateTo({
                    url: '/pagesUser/address/index',
                    success: function (e) {
                      let page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                            page.onShow();
                    }                         
                  })
              }, 1500) //延迟时间

          })
        }
      }
    })
  },
  handleEdit(e){  
    let item=e.currentTarget.dataset.item
    this.router("/pagesUser/address/add-edit/index?type=u&item="+JSON.stringify(item))
  },
  onLoad(){

    this.AddressList({token:this.getStorage('user_info').wx_openid}).then(res=>{
      if(res.resCode=='9999'){
        this.setData({
          list:res.data.list
        })
      }
    })

  }


})