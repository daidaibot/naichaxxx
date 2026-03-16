//登录
export const routeToLogin = (event) => {
  console.log('login',event)
  let recommendId=event.currentTarget.dataset.recommendid
  if(recommendId){
    var url="/pages/login/index?recommendId="+recommendId
  }else{
    var url="/pages/login/index"
  }
	router(url, 'navigateTo')
}

//首页
export const routeToHome = () => {
	router('/pages/home/index', 'reLaunch')
}
//会员中心
export const routeToMine = () => {
	router('/pages/mine/index', 'reLaunch')
}

//订单中心
export const routeToOrder = () => {
	router('/pages/order/index', 'reLaunch')
}

export const router = (url, type = 'navigateTo') => {
	isRouterType(type)
	wx[type].call(wx, {
		url
	})
}

export const back = (delta) => {
	wx.navigateBack({
		delta: delta || 1
	})
}

const isRouterType = (t) => {
	if (!['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'].includes(t)) {
		console.warn('type 属性可选值为 navigateTo，redirectTo，switchTab，reLaunch', t)
		return false
	}

	return true
}