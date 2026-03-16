import { skipNulls } from '../util.js';


const config = require('../config.js')
const {
	getStorage
} = require('../storage.js')
const {
	routeToLogin
} = require('../router.js')

// 添加事件结束
Promise.prototype.finally = function(callback) {
	var Promise = this.constructor;
	return this.then(
		function(value) {
			Promise.resolve(callback()).then(
				function() {
					return value
				}
			)
		},
		function(reason) {
			Promise.resolve(callback()).then(
				function() {
					throw reason
				}
			)
		}
	)
}

const request = ({
	url,
	data,
	method,
	contentType
}) => {
	return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中'
    })

		wx.request({
			url: `${config[config.dev_env].url}${url}`,
			data: data,
			method: method,
			header: {
				'content-type': contentType || 'application/json',
				'token': getStorage('token')
			},
			success: (res) => {
        wx.hideLoading();
				// 返回成功提示信息
				if (res.statusCode === 200) {
					// 未登录拦截
					if (res.data.code === 401) {
						routeToLogin('redirectTo')
					} else {
						resolve(res.data)
					}
				} else {
					// 返回错误提示信息
					reject(res.data)
				}
			},
			fail: (res) => {
        wx.hideLoading();
				// 返回错误提示信息
				reject('系统开小差了，请联系在线客服哦~')
			},
			complete: () => {}
		})
	})
}

export const getRequest = (url, data) => {
	data = skipNulls(data)
	return request({
		url,
		data,
		method: 'GET'
	})
}

export const postRequest = (url, data, isJson) => {
	return request({
		url,
		data,
		method: 'POST',
		contentType: isJson ? 'application/json' : 'application/x-www-form-urlencoded'
	})
}

export const putRequest = (url, data, isJson) => {
	return request({
		url,
		data,
		method: 'PUT',
		contentType: isJson ? 'application/json' : 'application/x-www-form-urlencoded'
	})
}

export const deleteRequest = (url, data) => {
	return request({
		url,
		data,
		method: 'DELETE'
	})
}

export const getBaseUrl = (url) => {
	return `${config[config.dev_env].url}${url}`
}
