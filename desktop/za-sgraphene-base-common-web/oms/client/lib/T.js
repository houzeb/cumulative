// import config from '../../config';

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

// 解决IE11不兼容startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

var T = window.T = {
    urlQuery: function(key, url) {
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
    }
};
export default T;
