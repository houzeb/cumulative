import fetch from 'isomorphic-fetch';
import { message } from 'antd';

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
}


var T = window.T = {
	host: "", //   这个地方不要动，是预留的配置，如果不走nodejs,就在这个地方配后端的域名。
	get: function (id) {
		return document.getElementById(id);
	},
	showInfo(msg) {
		message.info(msg);
	},
	showSuccess(msg) {
		message.success(msg);
	},
	showError(msg) {
		message.error(msg || "请求失败");
	},
	showWarn(msg) {
		message.warning(msg);
	},
	tryEval: function (js) {
		var result = null;
		if (!js) {
			return result;
		}
		if (typeof js !== "string") {
			return js;
		}
		try {
			result = JSON.parse(js)
		} catch (e) {
			console.log("[eval error json解析错误]" + e.message);
		}
		return result;
	},

	urlQuery: function (key, url) {
		url = url || location.href;
		var reg = new RegExp('[?&#]' + key + '=([^&#]*)', "i");
		var match = url.match(reg);
		var result;

		if (match) {
			try {
				result = decodeURIComponent(match[1]) || "";
				return result;
			} catch (e) {
			}
		}
		return "";
	},
	formatDate: function (format, date) {//   "yyyy-MM-dd hh:mm:ss"
		if (!date) return "";
		date = new Date(date);
		var o = {
			"M+": date.getMonth() + 1, //month
			"d+": date.getDate(),    //day
			"h+": date.getHours(),   //hour
			"m+": date.getMinutes(), //minute
			"s+": date.getSeconds(), //second
			"q+": Math.floor((date.getMonth() + 3) / 3), //quarter
			"S": date.getMilliseconds(), //millisecond
			"w": "日一二三四五六".charAt(date.getDay())
		}
		format = format.replace(/y{4}/i, date.getFullYear())
			.replace(/y{2}/i, date.getFullYear().toString().substring(2))

		for (var k in o) {
			var reg = new RegExp(k);
			format = format.replace(reg, match);
		}
		function match(m) {
			return m.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length);
		}
		return format;
	},
	isArray: function (obj) {
		return Object.prototype.toString.apply(obj) === "[object Array]";
	},
	formatReqData: function (data, percentKeyArr) {
		let arr = [];
		for (let key in data) {
			if (key == "cashBonusOption" || key == "liabilityCodes") {
				data[key] = data[key] && data[key].join(",")
			}
			if (percentKeyArr && percentKeyArr.indexOf(key) > -1) {
				data[key] = (data[key] / 100).toFixed(2);
			}
			arr.push({
				"customizeDefCode": key,
				"customizeDefValue": data[key]
			});
		}
		return arr;
	},
	getAttrObject: function (objArray, key, value) {//一个对象数组，获取key等于value的对象数组
		objArray = (objArray instanceof Array) ? objArray : [objArray];

		var arr = [];
		var item;
		var temp;
		for (var i = 0; i < objArray.length; i++) {
			item = objArray[i];
			if (item == undefined) {
				continue;
			}
			temp = (key instanceof Array) ? item[key[0]][key[1]] : item[key];

			if (value instanceof Array) {
				if (value.indexOf(temp) > -1) {
					arr.push(item);
				}
			} else {
				if (temp == value) {
					arr.push(item);
				}
			}

		}

		return arr;
	},
	cookie: {
		get: function (name) {
			var cookie = document.cookie,
				cookieName = encodeURIComponent(name) + '=',
				start = cookie.indexOf(cookieName),
				value = null;

			if (start > -1) {
				var cookieEnd = document.cookie.indexOf(';', start);
				if (cookieEnd == -1) {
					cookieEnd = document.cookie.length;
				}
				value = decodeURIComponent(document.cookie.substring(start + cookieName.length, cookieEnd));
			}

			return value;
		},
		set: function (name, value, param) {
			var text = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			param = param || {};
			param.path = param.path || "/";
			var expires = param.expires;
			if (expires instanceof Date) {
				text += ';expires=' + expires.toGMTString();
			} else if (typeof expires === "number") {
				text += ';expires=' + new Date(expires).toGMTString();
			}
			if (param.path) {
				text += ';path=' + param.path;
			}
			if (param.domain) {
				text += ';domain=' + param.domain;
			}
			if (param.secure) {
				text += ';secure';
			}
			document.cookie = text;
		},
		unset: function (name, path, domain, secure) {
			this.set(name, '', new Date(0), path, domain, secure);
		}
	},
	fetch(opt) {
		var param = {
			method: opt.method || "post",
			credentials: 'same-origin'
		}

		opt.url = opt.url.replace(/^\//, "")


		if (opt.method !== "get") {
			param.body = opt.data ? JSON.stringify(opt.data) : ""
		}
		if (opt.data instanceof FormData) {
			param.body = opt.data;
		}
		else {
			param.headers = {
				"Content-Type": opt.contentType || "application/json"
			}
		}

		let url = T.host + "/ajax/" + opt.url;

		if (T.host) {
			url = opt.url;
		}

		var loading;
		if (opt.loading) {
			loading = message.loading('loading..', 0)
		}

		return new Promise(function (resoved, reject) {
			fetch(url, param).then((res) => {

				loading && loading();
				var json = res.json();
				json.then((result) => {
					if (!result.success) {
						T.showError(result.errorMsg);
					}
					resoved(result);
				});
			});
		});
	}
}

export default T;