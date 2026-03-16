import {
  getRequest,
  postRequest
} from './request.js'

//用户登陆
export const login = (params) => {
  return postRequest('login/do_login', params)
}
//获取用户信息
export const getUser = (params) => {
  return postRequest('user/index', params)
}

//获取手机号
export const getPhone = (params) =>{
  return postRequest('login/getPhone', params)
}


export const dopay = (params) => {
  return getRequest('login/dopay', params)
}
//充值协议
export const cash_detail = (params) => {
  return getRequest('Index/cash_detail', params)
}

//商品分类信息
export const goodsCate = (params) => {
  return getRequest('Shop/shop_cate', params)
}

//商品详情
export const goods_info = (params) => {
  return getRequest('shop/goodsInfo', params)
}

//获取购物车数量
export const goodsCar_num = (params) => {
  return getRequest('Car/goodsCarNum', params)
}


//获取商品属性
export const goodsAttr = (params) => {
  return getRequest('Shop/goods_attr', params)
}

//加入购物车
export const goodsCar = (params) =>{
  return postRequest('car/add', params)
}

//购物车列表信息
export const carList = (params) =>{
  return postRequest('car/listing', params)
}

//修改购物车
export const caredit = (params) =>{
  return postRequest('car/edit', params)
}

//删除购物车
export const cardel = (params) =>{
  return postRequest('car/del', params)
}

//购物车结算
export const previewcar = (params)=>{
  return postRequest('order/previewcar', params)
}

//订单预览
export const preView = (params)=>{
  return postRequest('order/preview', params)
}

//提交订单
export const orderSubmit = (params)=>{
  return postRequest('Ordersubmit/submit', params)
}

//立即支付
export const orderpay = (params)=>{
  return postRequest('Wechat/orderpay', params)
}

//订单支付
export const orderpay2 = (params)=>{
  return postRequest('Wechat/orderpay2', params)
}

//(用户)订单列表信息
export const listIng = (params)=>{
  return postRequest('Orderlist/listing', params)
}

export const listIngNew = (params)=>{
  return postRequest('Orderlist/listing2', params)
}

//(商户)订单列表信息
export const Shoplist= (params)=>{
  return postRequest('Orderlist/Shoplisting', params)
}

//订单取消
export const orderCancel = (params)=>{
  return postRequest('Orderlist/cancel_order', params)
}

//订单详情
export const orderInfo = (params)=>{
  return postRequest('Orderlist/info', params)
}

//订单确认
export const orderReceipt = (params)=>{
  return postRequest('Orderlist/confirmReceipt', params)
}

//充值列表
export const docashList = (params)=>{
  return postRequest('user/docashList', params)
}

//立即充值
export const dorecharge = (params)=>{
  return postRequest('user/recharge', params)
}

//消费记录
export const moneylog_list = (params)=>{
  return postRequest('Moneylog/moneylog_list', params)
}

//优惠券列表
export const coupon_list = (params)=>{
  return postRequest('Coupon/couponLists', params)
}

//获取公告信息
export const getNotice = (params)=>{
  return postRequest('user/articleSting', params)
}

//我的收益
export const getUserIncome = (params)=>{
  return postRequest('user/UserIncome', params)
}

//商户资金记录
export const moneyshoplog_list= (params)=>{
  return postRequest('Moneylog/moneyshoplog', params)
}

//提现提交
export const Pdocash= (params)=>{
  return postRequest('User/docash', params)
}

//商户提现信息
export const cash_limit = (params)=>{
  return postRequest('User/cash_limit_info', params)
}

//提现记录
export const docashLog = (params)=>{
  return postRequest('User/docash_log', params)
}

//优惠券信息
export const couponList= (params)=>{
  return postRequest('Shop/coupon_list', params)
}


//领取优惠券
export const drawCoupon= (params)=>{
  return postRequest('Coupon/draw_coupon', params)
}

//故事信息
export const  NewList = (params)=>{
  return postRequest('index/new_list', params)
}

//故事信息
export const  NewInfo = (params)=>{
  return postRequest('index/new_info', params)
}

//获取地区
export const  areaList = (params)=>{
  return postRequest('Address/area_list', params)
}

//添加收货地址
export const  PostAddress = (params)=>{
  return postRequest('Address/add', params)
}

//收货地址列表
export const  AddressList = (params)=>{
  return postRequest('Address/listing', params)
}

//删除地址
export const  Addressdel = (params)=>{
  return postRequest('Address/del', params)
}


//获取等级权益
export const  getLevel= (params)=>{
  return postRequest('user/get_level', params)
}

//权益卡信息
export const wxPayLevel=(params)=>{
  return postRequest('user/do_level', params)
}

//收藏店铺
export const getCollect=(params)=>{
  return postRequest('Collect/shop_collect', params)
}

//店铺收藏列表
export const shopList=(params)=>{
  return postRequest('Collect/shop_list', params)
}

export const shopMoreList=(params)=>{
  return postRequest('shop/shop_list', params)
}

//积分记录
export const pointlog_list=(params)=>{
  return postRequest('Points/signlog', params)
}

//积分规则
export const aggregateInfo=(params)=>{
  return getRequest('index/aggregate_info', params)
}

//积分商品信息
export const  pointsList=(params)=>{
  return getRequest('Points/points_list', params)
}

//商品详情
export const pointsInfo=(params)=>{
  return getRequest('Points/points_info', params)
}


//获取签到规则
export const SignRule=(params)=>{
  return getRequest('Points/points_rule', params)
}

//点击签到
export const doSignRule=(params)=>{
  return getRequest('Points/signPoints', params)
}

//点击兑换
export const DochangeGoods=(params)=>{
  return getRequest('Points/changeGoods', params)
}

//获取兑换记录
export const changeGoodslog=(params)=>{
  return getRequest('Points/points_change_list', params)
}

//获取平台信息
export const getAbout=(params)=>{
  return getRequest('user/flat_about', params)
}


//获取平台信息
export const shopInfo=(params)=>{
  return getRequest('shop/shop_info', params)
}

//获取图片信息
export const shopPoster=(params)=>{
  return getRequest('Poster/getPoster', params)
}

//确认收货
export const  confirm_receipt=(params)=>{
  return postRequest('Orderlist/confirmOReceipt', params)
}


//员工管理
export const staff_list=(params)=>{
  return postRequest('user/staff_list', params)
}

//分享店铺信息
export const  ShopJoinInfo=(params)=>{
  return postRequest('shop/shopInfo', params)
}

//分享店铺信息
export const  doJoinStaff=(params)=>{
  return postRequest('user/JoinStaff', params)
}

export const  editStaff=(params)=>{
  return postRequest('user/edit_staff', params)
}

//会员权益
export const member_level=(params)=>{
  return getRequest('user/member_level', params)
}

//团队管理
export const groupInfo=(params)=>{
  return getRequest('user/member_group', params)
}

//bannber 
export const bannnerList=(params)=>{
  return getRequest('index/bannner_list', params)
}

//提交店铺资料
export const  doSelectShop=(params)=>{
  return postRequest('user/SelectShop', params)
}


//店铺资料信息
export const  selectShopList=(params)=>{
  return postRequest('index/selectShopList', params)
}


//店铺投资
export const  dopayShop=(params)=>{
  return postRequest('user/dopayShop', params)
}

//用户余额信息
export const  userAccount=(params)=>{
  return postRequest('user/userAccount', params)
}

//用户余额信息
export const  Index=(params)=>{
  return postRequest('Index/index', params)
}

//获取店铺信息
export const  doShopList=(params)=>{
  return postRequest('Index/ShopList', params)
}

//订单派发
export const  doorderSend=(params)=>{
  return postRequest('Index/orderSend', params)
}

//商品分类信息
export const  doGoodsCate=(params)=>{
  return postRequest('Shop/goodsCate', params)
}


//商品添加
export const  doGoodsAdd=(params)=>{
  return postRequest('Shop/goodsAdd', params)
}

//删除商品
export const  orderDel=(params)=>{
  return postRequest('Shop/orderDel', params)
}

//获取商品信息
export const  goodsCateList=(params)=>{
  return getRequest('Shop/shop_cate_list', params)
}

//获取商品信息
export const  goodsEdit=(params)=>{
  return getRequest('Shop/goodsedit', params)
}

//设置店铺信息
export const setShopInfo=(params)=>{
  return getRequest('Shop/setShopInfo', params)
}

//获取评论列表信息
export const  evaluate_list=(params)=>{
  return getRequest('shop/evaluateListing', params)
}

//获取评论列表信息
export const  doGoodsStock=(params)=>{
  return getRequest('shop/goodsStock', params)
}

export const  goodsShopCate=(params)=>{
  return getRequest('shop/shop_shop_cate', params)
}

//修改商品状态
export const doeditStatus=(params)=>{
  return getRequest('shop/shop_goods_status', params)
}

// 修改等级
export const dolevelSend=(params)=>{
  return postRequest('user/levelSend', params)
}

//获取信息
export const getorderdetail=(params)=>{
  return postRequest('order/orderdetail', params)
}

//评价信息
export const  doEvaluate=(params)=>{
  return postRequest('Orderlist/addEvaluate', params)
}


// 获取会员信息
export const  geMember=(params)=>{
  return postRequest('User/member_info', params)
}

//操作余额
export const update_balance=(params)=>{
  return postRequest('User/update_balance', params)
}

























