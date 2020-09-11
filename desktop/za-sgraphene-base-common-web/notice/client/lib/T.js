/*
 * @Author: za-zhouchiye
 * @Date: 2018-08-03 11:00:26
 * @Description: '通用工具类'
 * @Last Modified by: za-huxiaoyan
 * @Last Modified time: 2018-12-25 16:48:11
 * @ToDo: ''
 */

// 解决ie低版本浏览器不支持trim语法
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

const T = {
    urlQuery(key, url) {
        url = url || location.href;
        var reg = new RegExp('[?&#]' + key + '=([^&#]*)', 'i');
        var match = url.match(reg);
        var result;

        if (match) {
            try {
                result = decodeURIComponent(match[1]) || '';
                return result;
            } catch (e) {
                console.log(e);
            }
        }
        return '';
    },
    /**
     * @description 根据对象转url字符串参数
     * @param [object] param 将要转为URL参数字符串的对象
     * @param [string] key URL参数字符串的前缀
     * @param [boolean] encode true/false 是否进行URL编码,默认为true
     * @return [string] 返回url 参数字符串
    */
    urlEncode(param, key, encode) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t === 'string' || t === 'number' || t === 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    },
    /**
     * @description 根据url转参数对象
     * @param [string] url
     * @return [object] 返回url 参数对象
    */
    urlJson(url) {
        var arr = [];
        var res = {};
        arr = url.split('?')[1].split('&');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].indexOf('=') !== -1) {
                var str = arr[i].split('=');
                res[str[0]] = str[1];
            } else {
                res[arr[i]] = '';
            }
        }
        return res;
    },
    /**
     * @description formItem组件label支持国际化函数
     * @param [array] formItem 表单对象
     * @param [object] language 国际化列表对象
     * @param [array] i18nArray 找到formItem对应的key，然后替换成国际化字段的对象
     * @return [array] 返回新的表单对象formItem
    */
    formItemInter({
        formItem,
        language,
        i18nArray
    }) {
        i18nArray.forEach(i18nObj => {
            let key = i18nObj.key;
            let i18nKey = i18nObj.i18nKey;
            formItem.forEach(item => {
                if (item.key === key) {
                    item.label = language[i18nKey];
                }
            });
        });
        return formItem;
    },
    /**
     * @description 银行账号所有人姓名：ッャュョ 日文小写字分别替换为 ツヤユヨ 大写字符
     * @param {string} value  要替换的值
    */
    transAccountName(value) {
        if (!value) return '';
        // 半角小写ｯ:  半角大写ﾂ
        // 半角小写ｬ:  半角大写ﾔ
        // 半角小写ｭ:  半角大写ﾕ
        // 半角小写ｮ:  半角大写ﾖ
        const matchList = [
            ['ｯ', 'ﾂ'],
            ['ｬ', 'ﾔ'],
            ['ｭ', 'ﾕ'],
            ['ｮ', 'ﾖ']
        ];
        let newValue = value;
        matchList.forEach(item => {
            const [before, after] = item;
            newValue = newValue.replace(new RegExp(before, 'g'), after);
        });
        return newValue;
    }
};
export default T;
