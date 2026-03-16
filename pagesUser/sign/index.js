const app = getApp()
import calendarFormatter from "./points";
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,    
    points_info:{},
    date:'',
    use_date_arr:[],
     // 本月指的是选择的当前月份
     year: new Date().getFullYear(),
     month: new Date().getMonth() + 1,
     weeksArr: ['日', '一', '二', '三', '四', '五', '六'],
     nowMonth: new Date().getMonth() + 1, //本月是几月
     nowDay: new Date().getDate(), //本月当天的日期
     lastMonthDays: [], //上一个月
     nowMonthDays: [], //本月 
     nextMonthDays: [], //下一个月

  },

  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  onLoad(options) {
    let {
      year,
      month
  } = this.data
  this.getSignRule()
  setTimeout(()=>{

      this.createDays(year, month)
      this.selectComponent("#page").hideLoading()
   },1000)

  },

  onShow(){
  //   setTimeout(()=>{
  //     this.getSignRule()
  //  },2000)
  },

  //获取积分规则
  getSignRule(){
    let user_info = this.getStorage('user_info');
    let date=this.data.date
    let that=this
      this.SignRule({token:user_info.wx_openid,date:date}).then(res=>{
        console.log(res.data.date_array)
         if(res.resCode=='9999'){
           if(res.data.points_status==2){
            that.$showToast('功能已经关闭~');
            setTimeout(()=>{
              that.router('/pages/mine/index','reLaunch')
            },1000)
           
           }
           this.setData({
             points_info:res.data,
             use_date_arr:res.data.date_array
           })
         }
      })
  },
  //签到
  dosign(){
    let that=this
    var user_info = this.getStorage('user_info');
    this.doSignRule({token:user_info.wx_openid}).then(res=>{
        that.$showToast(res.resMessage)       
        setTimeout(()=>{
           this.onShow()
        },1000)
    })
  },

  changeMonth(e){
    console.log(e)
    let that=this
    let date_year=e.detail.year
    let date_month= e.detail.month<10?'0'+e.detail.month:e.detail.month
    let date=date_year+'-'+date_month
    let user_info = this.getStorage('user_info');
  
    this.SignRule({token:user_info.wx_openid,date:date}).then(res=>{
      console.log('res--',res.data.date_array)
        // if(res.resCode=='9999'){
          that.setData({
            points_info:res.data,
            use_date_arr:res.data.date_array
          })
        // }
    })    
  },
  //获取当月天数
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
},
/** 总方法 */
//创建日期
createDays(year, month) {
    this.getLastMonthDays(year, month)
    this.getNowMonthDays(year, month)
    this.getNextMonthDays(year, month)
},
/** 获取上个月日期 */
getLastMonthDays(year, month) {
    let nowMonthFirstDays = new Date(year, month - 1, 1).getDay()
    let lastMonthDays = []
    if (nowMonthFirstDays) { //判断当月的第一天是不是星期天
        //上个月显示多少天
        let lastMonthNums = month - 1 < 0 ? this.getThisMonthDays(year - 1, 12) : this.getThisMonthDays(year, month - 1); //判断是否会跨年
        //上个月从几号开始显示
        for (let i = lastMonthNums - nowMonthFirstDays + 1; i <= lastMonthNums; i++) {
            let time = new Date(year, month - 2, i).toLocaleDateString() //对应的时间
            lastMonthDays.push({
                date: i, //几号
                week: this.data.weeksArr[new Date(year, month - 2, i).getDay()], //星期几
                time,
                isNowMonthDay: ''
            });
        }
    }
    this.setData({
        lastMonthDays
    })
    // console.log('上个月',lastMonthDays);
},
/** 获取当月日期 */
getNowMonthDays(year, month) {
    let {
        nowMonth,
        nowDay
    } = this.data
    let nowMonthDays = []
    let days = this.getThisMonthDays(year, month); //获取当月的天数
    for (let i = 1; i <= days; i++) {
        let d = new Date(year, month - 1, i)
        let years = d.getFullYear()
        let months = d.getMonth() + 1
        let day2 = d.getDate()
        let time = `${years+'/'+months +'/'+day2}` // 2022/3/3
        let timer = time.replace(/\//g, "-")
        let timer2 = timer.split('-')
        var day = calendarFormatter.solar2lunar(timer2[0], timer2[1], timer2[2]);
        let newdate
        if (day.IDayCn == '初一') {
            newdate = day.IMonthCn
        } else {
            newdate = day.IDayCn
        }
        nowMonthDays.push({
            date: i, //几号
            week: this.data.weeksArr[new Date(year, month - 1, i).getDay()], //星期几
            time,
            color: false,
            day: newdate,
            isNowMonthDay: (month == nowMonth && i == nowDay) ? "isNowMonthDay" : ""
        });
    }
    console.log('use_date_arr-----------',this.data.use_date_arr)
    this.data.use_date_arr.forEach(ele => {
        ele = ele.replace(/\-/g, "/")
        nowMonthDays.forEach(item => {
            if (ele == item.time) {
                // console.log(item);
                item.color = true
            }
        })
    })
    this.setData({
        nowMonthDays
    })
    // console.log('当月',nowMonthDays);
},
/** 获取下个月日期 */
getNextMonthDays(year, month) {
    let {
        lastMonthDays,
        nowMonthDays,
    } = this.data
    let nextMonthDays = []
    let nextMonthNums = (lastMonthDays.length + nowMonthDays.length) > 35 ? 42 - (lastMonthDays.length + nowMonthDays.length) : 35 - (lastMonthDays.length + nowMonthDays.length) //下个月显示多少天
    let nowYear = (parseInt(month) + 1) > 12 ? year + 1 : year //下一个月的年份
    let nowMonth = (parseInt(month) + 1) > 12 ? 1 : parseInt(month) + 1 //下一个月的月份
    if (nextMonthNums) { //判断当前天数是否大于零
        for (let i = 1; i <= nextMonthNums; i++) {
            let time = new Date(year, month - 1, i).toLocaleDateString()
            nextMonthDays.push({
                date: i, //几号
                week: this.data.weeksArr[new Date(nowYear, nowMonth - 1, i).getDay()], //星期几
                time,
                isNowMonthDay: ''
            });
        }
    }
    this.setData({
        nextMonthDays
    })
    // console.log('下个月',nextMonthDays)
},
/** 切换月份 */
changeMonthFun(e){
   
    let {
        year,
        month,
        month1
    } = this.data
    let type = e.currentTarget.dataset.type //类型
    if (type == 'prev') { //上一个月
        year = month - 1 > 0 ? year : year - 1
        month = month - 1 > 0 ? month - 1 : 12
        month1 = month - 1 > 0 ? month +1 : 12
    } else { //next 下个月
        year = (parseInt(month) + 1) > 12 ? year + 1 : year
        month = (parseInt(month) + 1) > 12 ? 1 : parseInt(month) + 1
        month1 = (parseInt(month) + 1) > 12 ? 1 : parseInt(month) - 1
    }
    this.setData({
        year,
        month,
    })
    console.log('切换月份',year, month)
    this.triggerEvent('changeMonth',{year:year,month:month})
    setTimeout(()=>{
      this.createDays(year, month)
   },1000)
    
},
/** 选择日期触发 */
selectDate(e){
    let type = e.currentTarget.dataset.type //选择的时间类型
    let index = e.currentTarget.dataset.index //选择的下标
    let date = e.currentTarget.dataset.item.time //选择的下标
    let selectDate = date.replace(/\//g, "-")
    // console.log("选择的时间", selectDate)
    // 自定义事件，父组件调用，回调 选择的时间selectDate
    this.triggerEvent('selectDate', selectDate)
     //将选择的时间类型的 isNowMonthDay 全改为''
     this.data[type]?.forEach(item => {
        item.isNowMonthDay = ''
    })
    this.data[type]?.forEach((item, idx) => {
        if (index == idx) {
            item.isNowMonthDay = (item.time == new Date().toLocaleDateString() ? "isNowMonthDay" : "isNotNowMonthDay"); //判断当前选中的日期是否是当前时间
        } else {
            item.isNowMonthDay = ''
        }
    })
    this.setData({
        [type]: this.data[type],
    })
},
  


})