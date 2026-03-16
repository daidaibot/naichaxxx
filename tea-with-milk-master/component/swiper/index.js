const config = require('../libs/config.js')
const util = require('../libs/util.js')
const default_data = {
  current: 0,
  swiperCurrent: 0
}
const default_properties = {
  list: {
    type: Array,
    value: []
  },
  height: {
    type: String,
    value: '380rpx'
  },
  activeColor: {
    type: String,
    value: config.colors.primary
  },
  inactiveColor: {
    type: String,
    value: "#FFF"
  },
  //点的形状 可选值为 圆形：circle，正方形：square
  shape: {
    type: String,
    value: 'circle'
  },
  borderRadius: {
    type: String,
    value: '0'
  },
}
Component({
  properties: {
    ...default_properties
  },

  data: {
    ...default_data
  },

  methods: {
    swiperChange: function(e) {
       //防止swiper控件卡死
       if (this.data.swiperCurrent == 0 && this.data.swiperCurrent>1 ) {//卡死时，重置current为正确索引
        this.setData({ swiperCurrent: this.data.swiperCurrent });
      }
      else {//正常轮转时，记录正确页码索引
        this.setData({ swiperCurrent: e.detail.current });
      }
    },
    handleClickItem(e){
      const item = e.currentTarget.dataset.item
      this.triggerEvent('click', item);
    }
  }
})