// pagesGoods/detail/index.js
const app = getApp()
Page({
  ...app.globalData.function,
  data: {
    ...app.globalData.config,
    fileList:[],
    address:'',
    phone:'',
    realname:'',
    loading:false
  },

  
  onLoad(options) {

  },


  onShow() {

  },


  afterRead(event) {
    const { file } = event.detail;    
    var that = this
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
    that.setData({ fileList })
    // console.log('fileList',that.data.fileList)
    // console.log('file',file)
    //上传服务器
    for (let i = beforeNum; i < totalNum; i++) {
          that.uploadImg(i,that.data.fileList[i].url )
    }
    
  },
  uploadImg(fileListIndex,fileURL) {
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


      that.setData({
        [`fileList[${fileListIndex}].url`]: tem.data.image,
        [`fileList[${fileListIndex}].status`]: 'done'
      })

      wx.showToast({ title: '上传成功', icon: 'none' })

      },
      fail: function (res) {
        console.log("file upload fail")
      },
    })
  },

  /* 删除图片*/
  deleteImg(event) {
    var image_index = event.detail.index
    var fileList_new = this.data.fileList;
    fileList_new.splice(image_index,1);
    this.setData({
      fileList: fileList_new
    })
  },

  formSubmit: function (e) {
    let _that = this;
    let address = e.detail.value.address;
    let realname = e.detail.value.realname;
    let phone = e.detail.value.phone;
    let content = e.detail.value.content;
    // let regPhone = /^1[3578]\d{9}$/;
    // let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '填写选择店铺的原因!',
      })
      return false
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请留下您的选择地铺的地址!',
      })
      return false
    }
    if(realname == "") {
      wx.showModal({
        title: '提示',
        content: '请留下您的姓名!',
      })
      return false
    }

    if(phone == "") {
      wx.showModal({
        title: '提示',
        content: '请留下您的手机号!',
      })
      return false
    }
   
      this.setData({
        loading: true
      })

      let obj_data={
        token:this.getStorage('user_info').wx_openid,
        content,
        fileList:JSON.stringify(this.data.fileList),
        address,
        realname,
        phone,
      }
      this.doSelectShop(obj_data).then(res=>{
        if(res.resCode=="9999"){
          wx.showToast({title:res.resMessage,icon:"none"})
          setTimeout(function(){
            _that.router('/pagesUser/selectList/index')
          },3000)
        }
      })      
  },
})