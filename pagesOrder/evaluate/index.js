import { isJSON } from "../../utils/util";

let app = getApp();
Page({

  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    orderId:'',
    rate_eavl: 0,
    rate_value: 0,
    isSubmit: true,
    eval_but: [],
    order_list:{},
    fileList:[],
    evaluate_info:{},
    loading: false,
  },  
  onLoad(options) {

    if(options.orderId){
      this.setData({
        orderId:options.orderId
      })
    }

    let that=this     
      let obj_data={
        token:this.getStorage('user_info').wx_openid,
        order_id:this.data.orderId
      }      
      this.orderInfo(obj_data).then(res=>{
        let evaluate_info=[]
        if(res.resCode=="9999"){
          for (let j = 0; j < res.data.goods.length; j++) {
            let obj_data={
                order_goods_id:res.data.goods[j].order_goods_id,
                star1:5,
                star2:5,
                star3:5,
                remark:'',
                image:[],                 
            }             
            evaluate_info.push(obj_data)
          }
          that.setData({
            order_list:res.data,
            evaluate_info:evaluate_info
          })
        }else{
          wx.showToast({title:res.resMessage,icon:"none"})
        }
      }) 

  },

  
  onShow() {
        
    
  },

  afterRead(event) {
    const { file } = event.detail;    
    let order_goods_id=event.currentTarget.dataset.id
    var that = this
    let order_list=that.data.order_list
    let evaluate_info= this.data.evaluate_info
    const fileList = that.data.fileList
    //获得这次上传的图片数量，上传时避免重复上传之前传过的文件
    const thisNum = file.length 
    const beforeNum = fileList.length 
    const totalNum = thisNum + beforeNum
    //还没上传时将选择的图片的上传状态设置为加载   
    
    
    for (let j = 0; j < thisNum; j++) {
      file[j].status='uploading'
      fileList.push(file[j])
    }
    for (let j = 0; j < order_list.goods.length; j++) {
      if(order_list.goods[j].order_goods_id==order_goods_id){        
        order_list.goods[j].image=fileList       
      }     
    }
    that.setData({ order_list })
    //上传服务器
    for (let i = beforeNum; i < totalNum; i++) {
          that.uploadImg(i,that.data.fileList[i].url,order_goods_id)
    }

    for (let j = 0; j < order_list.goods.length; j++) {
      if(order_list.goods[j].order_goods_id==order_goods_id){        
        var image= order_list.goods[j].image       
      }     
    }

    for (let j = 0; j < evaluate_info.length; j++) {
      if(evaluate_info[j].order_goods_id==order_goods_id){
         evaluate_info[j].image=image
      }
    }
    that.setData({ evaluate_info,fileList:[] })
  },
  uploadImg(fileListIndex,fileURL,order_goods_id) {
    var that = this
    let order_list=that.data.order_list
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

      for (let j = 0; j < order_list.goods.length; j++) {
        if(order_list.goods[j].order_goods_id==order_goods_id){ 
          order_list.goods[j].image[fileListIndex].url= tem.data.image  
          order_list.goods[j].image[fileListIndex].status= 'done'   
          that.setData({order_list})             
        }     
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
    let order_list=this.data.order_list
    let evaluate_info=this.data.evaluate_info
    let order_goods_id=event.currentTarget.dataset.id
    for (let j = 0; j < order_list.goods.length; j++) {
      if(order_list.goods[j].order_goods_id==order_goods_id){ 
        let imag=order_list.goods[j].image
        imag.splice(event.detail.index, 1);
        order_list.goods[j].image=imag     
        this.setData({order_list})             
      }     
    }

    for (let j = 0; j < order_list.goods.length; j++) {
      if(order_list.goods[j].order_goods_id==order_goods_id){        
        var image= order_list.goods[j].image       
      }     
    }

    for (let j = 0; j < evaluate_info.length; j++) {
      if(evaluate_info[j].order_goods_id==order_goods_id){
         evaluate_info[j].image=image
      }
    }
    this.setData({evaluate_info}) 
  },

  //小星星
  changeStar(e){
    let order_goods_id=e.currentTarget.dataset.id
    let evaluate_info= this.data.evaluate_info
    let star=e.detail  
    let type=e.currentTarget.dataset.star
    
   
    for (let j = 0; j < evaluate_info.length; j++) {
      if(evaluate_info[j].order_goods_id==order_goods_id){
        if(type=='star1'){
          evaluate_info[j].star1=star
        } else if(type=='star2'){
          evaluate_info[j].star2=star
        }else if(type=='star3'){
          evaluate_info[j].star3=star
        }     
      }
    }
    this.setData({evaluate_info});
  },

  //备注信息
  setMessage(e){
    let order_goods_id=e.currentTarget.dataset.id
    let evaluate_info= this.data.evaluate_info
    let market=e.detail.value
    for (let j = 0; j < evaluate_info.length; j++) {
      if(evaluate_info[j].order_goods_id==order_goods_id){
      evaluate_info[j].remark=market
      }
    } 
    this.setData({evaluate_info}); 
  }, 

  
  //信息提交
  submit(){
    let that=this
    let evaluate_info= this.data.evaluate_info
    for (let j = 0; j < evaluate_info.length; j++) {
       if(!evaluate_info[j].remark){
        this.$showToast('请填写评价信息！')
        return
       }
       
    }
    let obj_data={
        token:this.getStorage('user_info').wx_openid,
        order_id:this.data.orderId,
        eval_info:JSON.stringify(evaluate_info)
    }
    // console.log(obj_data)
    // return
    this.doEvaluate(obj_data).then(res=>{
      this.$showToast(res.resMessage) 
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/order/index'
        })       
      },3000)  
    })
  }
})