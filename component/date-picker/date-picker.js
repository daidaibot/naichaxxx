Component({
  /**
   * 组件的属性列表
   */
  properties: {
      range: { //可预约的日期范围。默认日期从今天开始，到第range天后为止，这里设为10天
          type: Number,
          value: 10
      },
      start_time: { //开始时间，设为整点
          type: Number,
          value: 8
      },
      step: { //预约时间的步长，设置为30，表示30分钟
          type: Number,
          value:40
      },
      end_time: { //结束时间，设为整点
          type: Number,
          value: 22
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      isShow: false,
      selectDate: "",
      dialogh: 0,

      //日期列表和时间列表
      date_list: [],
      time_list: []
  },
  
  methods: {

    timeSelect () {
      let start_day = (new Date().getTime()+1200000);
      console.log('start_day',start_day); //2021-08-31
      console.log(new Date());
      let end_day = (new Date().setDate(new Date().getDate() + this.properties.range))
      console.log('end_day',start_day); //2021-08-31
      //获取日期列表
     

      // 获取当前时间
      var currentDate = new Date();
      // 获取当前小时数
      var currentHour = currentDate.getHours();
      if(currentHour < this.properties.start_time){
          currentHour =this.properties.start_time
      }

      if(currentHour>this.properties.end_time){
         start_day = (new Date().getTime()+ 1000*60*60*24);
         currentHour =this.properties.start_time
      }

      let date_list = this.getDiffDate(start_day, end_day);

      let time_list = this.getTimeList(currentHour, this.properties.end_time, this.properties.step);
      console.log('--time_list--',time_list);
      this.setData({
          // date_time: [date_column, time_column],
          date_list: date_list,
          time_list: time_list,
      })
      //动画
      this.animation = wx.createAnimation({
          duration: 300
      })
      //500rpx转成px
      let dialoghpx = 800 / 750 * wx.getSystemInfoSync().windowWidth
      this.setData({
          dialogh: dialoghpx,
          selectDate: this.data.date_list[0] + this.data.time_list[0]
      })},


      getDiffDate(start, end) {
          let startTime = new Date(start);
          let endTime = new Date(end);
          let dateArr = [];
          while ((endTime.getTime() - startTime.getTime()) >= 0) {
              dateArr.push(this.ts_string(startTime.getTime()));
              startTime.setDate(startTime.getDate() + 1);
          }

          return dateArr;
      },
      zfill(num, length) {
          return (Array(length).join("0") + num).slice(-length);
      },
      //把日期转换成xxxx-xx-xx的形式
      ts_string(timestamp) {
          let d = new Date(timestamp);
          let day = "";
          switch (d.getDay()) {
              case 1:
                  day = "周一";
                  break;
              case 2:
                  day = "周二";
                  break;
              case 3:
                  day = "周三";
                  break;
              case 4:
                  day = "周四";
                  break;
              case 5:
                  day = "周五";
                  break;
              case 6:
                  day = "周六";
                  break;
              case 0:
                  day = "周日";
                  break;
          }
          let string = (d.getFullYear()) + "-" +
              this.zfill((d.getMonth() + 1), 2) + "-" +
              this.zfill((d.getDate()), 2) + " (" + day + ")"
          return string
      },
      //获取时间区间列表，输入(起始时间，结束时间，步长)
      getTimeList(start, end, step) {
          let start_time = new Date();
          //设置起始时间
          start_time.setHours(start, 0, 0);
          console.log('--start_time--',start_time);
          //设置结束时间
          let end_time = new Date();
          end_time.setHours(end, 0, 0);
          let startG = start_time.getTime(); //起始时间的格林时间
          let endG = end_time.getTime(); //起始时间的格林时间
          let step_ms = step * 60 * 1000;
          let timeArr = [];
          while (startG < endG) {
              let time = this.timeAdd(startG, step_ms);
              timeArr.push(time);
              startG += step_ms;
          }

          return timeArr;
      },
      timeAdd(time1, add) {
          var nd = new Date(time1); //创建时间对象
          //获取起始时间的时分秒
          var hh1 = nd.getHours();
          var mm1 = nd.getMinutes();
          if (hh1 <= 9) hh1 = "0" + hh1;
          if (mm1 <= 9) mm1 = "0" + mm1;
          nd = nd.valueOf(); //转换为毫秒数
          nd = nd + Number(add);
          nd = new Date(nd);
          var hh2 = nd.getHours();
          var mm2 = nd.getMinutes();
          if (hh2 <= 9) hh2 = "0" + hh2;
          if (mm2 <= 9) mm2 = "0" + mm2;
          var time = hh1 + ":" + mm1 + "-" + hh2 + ":" + mm2;
          return time; //时间段
      },
      change: function (e) {
        
        const val = e.detail.value;
        const date=this.data.date_list[val[0]].split(" ")[0]
        let time = this.getTime(new Date())
        console.log('变化了',date);
        
        if(date==time){
          // 获取当前时间
          var currentDate = new Date();
          // 获取当前小时数
          var currentHour = currentDate.getHours();
          if(currentHour < this.properties.start_time){
              currentHour =this.properties.start_time
          }

          let time_list = this.getTimeList(currentHour, this.properties.end_time, this.properties.step);
          this.setData({       
            time_list: time_list,
          })
        }else{
          let time_list = this.getTimeList(this.properties.start_time, this.properties.end_time, this.properties.step);
          this.setData({       
            time_list: time_list,
          })

        }  

          //val[0]表示选择的第一列序号，val[1]表示选择的第二列序号
          let select = this.data.date_list[val[0]] + this.data.time_list[val[1]]
          console.log(select);
          this.setData({
              selectDate: select
          })

      },

      getTime(date) {
          let y = date.getFullYear() //年
          let m = date.getMonth() + 1  //月，月是从0开始的所以+1
          let d = date.getDate() //日
          m = m < 10 ? "0" + m : m //小于10补0
          d = d < 10 ? "0" + d : d //小于10补0
          return y + "-" + m + "-" + d; //返回时间形式yyyy-mm-dd
      },
      showDialog(start_time,end_time) {
        console.log('start_time--ok--',start_time);
        console.log('end_time--ok--',end_time);
        this.properties.start_time=start_time
        this.properties.end_time=end_time
        this.timeSelect()
        this.setData({
            isShow: true
        })
         

          
          //先向下移动dialog高度，然后恢复原位从而形成从下向上弹出效果
          this.animation.translateY(this.data.dialogh).translateY(0).step()
          this.setData({
              animation: this.animation.export()
          })
      },
      dimsss() {
          //从原位向下移动dailog高度，形成从上向下的收起效果
          this.animation.translateY(this.data.dialogh).step()
          this.setData({
              animation: this.animation.export()
          })
          //动画结束后蒙层消失
          setTimeout(() => {
              this.setData({
                  isShow: false
              })
          }, 300)
      },
      cancel() {
          this.triggerEvent("cancel")
          this.dimsss()
      },
      confirm() {
          this.triggerEvent("confirm", {
              selectDate: this.data.selectDate
          })
          this.dimsss()
      }
  }
})