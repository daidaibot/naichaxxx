// components/Navigation/index.js
Component({

  properties: {
    navId: {
      type: Number,
      value: 1
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    selected:0,
    list: [ {
      "pagePath": "/pages/home/index",
      "iconPath": "/images/tabs/home_unselected.png",
      "selectedIconPath": "/images/tabs/home_selected.png",
      "text": "首页"
    },
    {
      "pagePath": "/pages/release/index",
      "iconPath": "/images/tabs/classify_unselected.png",
      "selectedIconPath": "/images/tabs/classify_selected.png",
      "text": "点单"
    },
    {
      "pagePath": "/pages/mine/index",
      "iconPath": "",
      "selectedIconPath": "",
      "text": ""
    },
    {
      "pagePath": "/pages/mine/index",
      "iconPath": "",
      "selectedIconPath": "",
      "text": "订单"
    },
    {
      "pagePath": "/pages/mine/index",
      "iconPath": "",
      "selectedIconPath": "",
      "text": "我的"
    }],
  },
  ready(){
    console.log(11,this.properties.navId)
    this.initialHeight();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取底部安全距离
    initialHeight(){
      const sysInfo = wx.getSystemInfoSync();
      this.setData({
        emptyHeight: sysInfo.windowHeight - sysInfo.safeArea.bottom
      })
    },
    // 跳转
    jump2Event(e){
      const data = e.currentTarget.dataset,
            currentNav = this.data.navList.filter(item => item.id == data.id)[0];
      if(currentNav['path']) {
        wx.reLaunch({
          url: currentNav['path'],
        })
      } else if(data.id == -1){
        // 扫码
        wx.scanCode({
          success: res => {
            console.log('success', res);
          },
          fail: msg => {
            console.error(msg);
          }
        });
      }
      // if end
    }
  }
})