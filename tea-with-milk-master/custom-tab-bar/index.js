Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [ {
      "pagePath": "/pages/home/index",
      "iconPath": "/images/tabs/home_unselected.png",
      "selectedIconPath": "/images/tabs/home_selected.png",
      "text": "首页"
    },
    {
      "pagePath": "/pages/classify/index",
      "iconPath": "/images/tabs/classify_unselected.png",
      "selectedIconPath": "/images/tabs/classify_selected.png",
      "text": "点单"
    },
    {
      "pagePath": "/pages/membership/index",
      "iconPath": "/images/tabs/san_seleted.png",
      "selectedIconPath": "/images/tabs/san_seleted.png",
      "text": ""
    },
    {
      "pagePath": "/pages/order/index",
      "iconPath": "/images/tabs/allorder.png",
      "selectedIconPath": "/images/tabs/allorder_unselected.png",
      "text": "订单"
    },
    {
      "pagePath": "/pages/mine/index",
      "iconPath": "/images/tabs/mine_unselected.png",
      "selectedIconPath": "/images/tabs/mine_selected.png",
      "text": "我的"
    }
  ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
     
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      if(url=='/pages/classify/index'){
        wx.navigateTo({url})
      }else{
        wx.switchTab({url})
      }
      this.setData({
        selected: data.index
      })
    }
  }
})