const app = getApp()
var that
var list = []

function Detail(placeName, number) {
   
}
function Info() {
   this.details = [];
}



Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    multiIndex: [],
    multiArray: [
      [  "盐田", "龙岗区", "宝安区", "光明新区", "龙华新区", "坪山新区"]
    
    ],
    classArray: [
    ],
    fileList7:[],
    fileList:[],
    fileList1:[],
    fileList2:[],
    fileList3:[],
    // fileList4:[],
    fileList5:[],
    info: {},
    goods_spec_name:'规格',
    goods_value:'默认',
    goods_price:0,
    goods_stock:0,
    cateId:'',
    catePId:'',
    goodsId:'',
    goodsInfo:{},
    goodsSkuId:[]
  },

  init: function () {
    let that = this;
    this.setData({
       info: new Info(),
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init();

    if(options && options.goodsId){
        this.setData({
          goodsId:options.goodsId
        })
    }
    console.log(options);
    this.doGoodsCate().then(res=>{
      if(res.resCode=="9999"){
         this.setData({
            multiArray:res.data.goods_cates_name,
            classArray:res.data.goods_cates,
         })
      }
   })

  },

  addItem: function (e) {
    let info = this.data.info;
    info.details.push(new Detail());
    this.setData({
       info: info
    });
},

  removeItem:function(e){
    let delIndex=e.currentTarget.dataset.index
    let goodsSkuId=this.data.goodsSkuId
    let skuid=e.currentTarget.dataset.skuid
    goodsSkuId.push(skuid)

    const info = this.data.info
    info.details.splice(delIndex, 1)
    this.setData({
      info,
      goodsSkuId
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(this.data.goodsId){
      this.goodsEdit({goodsId:this.data.goodsId}).then(res=>{
          if(res.resCode=='9999'){
            this.setData({
              goodsInfo:res.data,
              fileList1:res.data.fileList1,
              fileList2:res.data.fileList2,
              goods_spec_name:res.data.spec_name,
              fileList3:res.data.goods_sku.fileList3,  
              fileList5:res.data.fileList5,  
              info:{
                details:res.data.goods_sku_lists
              }            
            })
          }
      })
    }
    this.setData({
      goodsSkuId:[]
    })
  },

  formSubmit: function (e) {       
    let val=e.detail.value
    let user_info= this.getStorage('user_info')
    val.storageId=user_info.shopInfo.id
    val.image1=JSON.stringify(this.data.fileList1)
    val.image2=JSON.stringify(this.data.fileList2)
    val.image3=JSON.stringify(this.data.fileList3)
    val.info=JSON.stringify(this.data.info)
    val.image5=JSON.stringify(this.data.fileList5)
    val.goodsId=this.data.goodsId
    val.goodsSkuId=this.data.goodsSkuId
    // console.log(user_info)
    
    this.doGoodsStock(val).then(res=>{
      if(res.resCode=="9999"){
        this.$showToast(res.resMessage)
         setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },2000)
      }else{
        this.$showToast(res.resMessage)
      }
   })

   

  },


  // 点击确认时触发
  bindMultiPickerChange(event) {
    this.setData({
      multiIndex: event.detail.value
    })
  },

  // 列改变时触发
  bindMultiPickerColumnChange(event) {
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
	  // 获取滚动的是哪一列
    data.multiIndex[event.detail.column] = event.detail.value

    // 遍历 classArray
    this.data.classArray.forEach((item, index) => {
      // 滚动第一列
      if(event.detail.column === 0) {
        // 如果滚动到二年级 则将第二列的班级 替换成二年级对应的班级
        if(data.multiIndex[0] === index) {
          data.multiArray[1] = item
        }
        // 每次滚动 就把第二列默认设置为第一个
        data.multiIndex[1] = 0
      }
      this.setData(data)
    })
  },


  afterRead(event) {   
    // 1:主图
    const type=event.currentTarget.dataset.type
    console.log(type)
    if(type==1){        
        const { file } = event.detail;    
        var that = this
        const fileList = that.data.fileList1
        //获得这次上传的图片数量，上传时避免重复上传之前传过的文件
        const thisNum = file.length 
        const beforeNum = fileList.length 
        const totalNum = thisNum + beforeNum
        //还没上传时将选择的图片的上传状态设置为加载    
        for (let j = 0; j < thisNum; j++) {
          file[j].status='uploading'
          fileList.push(file[j])
        }
        that.setData({ fileList1:fileList })
        //上传服务器
        for (let i = beforeNum; i < totalNum; i++) {
              that.uploadImg(i,that.data.fileList1[i].url,type)
        }
    }else if(type==2){        
        const { file } = event.detail;    
        var that = this
        const fileList = that.data.fileList2
        //获得这次上传的图片数量，上传时避免重复上传之前传过的文件
        const thisNum = file.length 
        const beforeNum = fileList.length 
        const totalNum = thisNum + beforeNum
        //还没上传时将选择的图片的上传状态设置为加载    
        for (let j = 0; j < thisNum; j++) {
          file[j].status='uploading'
          fileList.push(file[j])
        }
        that.setData({ fileList2:fileList })
        //上传服务器
        for (let i = beforeNum; i < totalNum; i++) {
              that.uploadImg(i,that.data.fileList2[i].url,type)
        }    
    }else if(type==3){        
      const { file } = event.detail;    
      var that = this
      const fileList = that.data.fileList3
      //获得这次上传的图片数量，上传时避免重复上传之前传过的文件
      const thisNum = file.length 
      const beforeNum = fileList.length 
      const totalNum = thisNum + beforeNum
      //还没上传时将选择的图片的上传状态设置为加载    
      for (let j = 0; j < thisNum; j++) {
        file[j].status='uploading'
        fileList.push(file[j])
      }
      that.setData({ fileList3:fileList })
      //上传服务器
      for (let i = beforeNum; i < totalNum; i++) {
            that.uploadImg(i,that.data.fileList3[i].url,type)
      }    
    }else if(type==4){        
        const { file } = event.detail;    
        var that = this
        const index=event.currentTarget.dataset.index
        const fileList = that.data.fileList7
        const info = that.data.info
        //获得这次上传的图片数量，上传时避免重复上传之前传过的文件
        const thisNum = file.length 
        const beforeNum = fileList.length 
        const totalNum = thisNum + beforeNum
        //还没上传时将选择的图片的上传状态设置为加载    
        for (let j = 0; j < thisNum; j++) {
          file[j].status='uploading'
          fileList.push(file[j])
        }
        for (let j = 0; j < info.details.length; j++) {
          if(j==index){        
            info.details[j].image=fileList       
          }     
        }
        that.setData({ fileList,
          fileList7:[] })
        
        //上传服务器
        for (let i = beforeNum; i < totalNum; i++) {
              that.uploadImg(i,that.data.fileList[i].url,type,index)
        }    
    }else if(type==5){
      const { file } = event.detail;    
      var that = this
      const fileList = that.data.fileList5
      //获得这次上传的图片数量，上传时避免重复上传之前传过的文件
      const thisNum = file.length 
      const beforeNum = fileList.length 
      const totalNum = thisNum + beforeNum
      //还没上传时将选择的图片的上传状态设置为加载    
      for (let j = 0; j < thisNum; j++) {
        file[j].status='uploading'
        fileList.push(file[j])
      }
      that.setData({ fileList5:fileList })
      //上传服务器
      for (let i = beforeNum; i < totalNum; i++) {
            that.uploadImg(i,that.data.fileList5[i].url,type)
      }    
    }

    
  },
  uploadImg(fileListIndex,fileURL,type,index) {
    var that = this
    //上传文件
    const filePath = fileURL // 小程序临时文件路径
    // console.log("filePath",filePath)
    wx.uploadFile({
      url: this.data.api_url+'/api/index/uploadImage',
      filePath: filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
      },
      formData: { 
        fileType:'image',
        reName:'true',
        thumbnail:'true'
      },
      success(res) {
      var tem = JSON.parse(res.data)
      // 上传完成需要更新 fileList
      if(type==1){
        that.setData({
          [`fileList1[${fileListIndex}].url`]: tem.data.image,
          [`fileList1[${fileListIndex}].status`]: 'done'
        })
      }else if(type==2){
        that.setData({
          [`fileList2[${fileListIndex}].url`]: tem.data.image,
          [`fileList2[${fileListIndex}].status`]: 'done'
        })
      }else if(type==3){
        that.setData({
          [`fileList3[${fileListIndex}].url`]: tem.data.image,
          [`fileList3[${fileListIndex}].status`]: 'done'
        })
      }else if(type==4){
        let info=that.data.info
        for (let j = 0; j < info.details.length; j++) {
          if(j==index){        
            info.details[j].image[fileListIndex].url= tem.data.image    
            info.details[j].image[fileListIndex].status= 'done' 
            that.setData({info})      
          }     
        }
      }else if(type==5){
        that.setData({
          [`fileList5[${fileListIndex}].url`]: tem.data.image,
          [`fileList5[${fileListIndex}].status`]: 'done'
        })
      }
      wx.showToast({ title: '上传成功', icon: 'none' })

      },
      fail: function (res) {
        console.log("file upload fail")
      },
    })
  },

   /* 删除图片*/
   deleteImg(event) {
    const type=event.currentTarget.dataset.type
    const index=event.currentTarget.dataset.index   
    
    const delIndex = event.detail.index   
    if(type==1){
        const  fileList1  = this.data.fileList1
        fileList1.splice(delIndex, 1)
        this.setData({
          fileList1
        })  
    }else if(type==2){
      const  fileList2  = this.data.fileList2
      fileList2.splice(delIndex, 1)
      this.setData({
        fileList2
      })  
    }else if(type==3){
      const  fileList3  = this.data.fileList3
      fileList3.splice(delIndex, 1)
      this.setData({
        fileList3
      })
    }else if(type==4){
        const  info  = this.data.info
        info.details[index].image.splice(delIndex, 1)
        this.setData({
          info
        })  
      }else if(type==5){
        const  fileList5  = this.data.fileList5
        fileList5.splice(delIndex, 1)
        this.setData({
          fileList5
        })
      }  
  },






 
})