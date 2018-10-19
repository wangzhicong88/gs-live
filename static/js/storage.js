/*
      storage 主要放项目中的storage相关操作：存取等
 */
var storage = {
     /**
      对本地数据进行操作的相关方法，如localStorage,sessionStorage,cookie的封装
     */
     setStorage: function(key, value, duration) {
         var data = {
             value: value,
             expiryTime: !duration || isNaN(duration) ? 0 : this.getCurrentTimeStamp() + parseInt(duration)
         };
         localStorage[key] = JSON.stringify(data);
     },
     getStorage: function(key) {
         var data = localStorage[key];
         if (!data || data === "null") {
             return null;
         }
         var now = this.getCurrentTimeStamp();
         var obj;
         try {
             obj = JSON.parse(data);
         } catch (e) {
             return null;
         }
         if (obj.expiryTime === 0 || obj.expiryTime > now) {
             return obj.value;
         }
         return null;
     },
     removeStorage: function(key){
         localStorage.removeItem(key);
     },
     clearStorage: function(key){
         localStorage.clear();
     },
     getSession: function(key) {
         var data = sessionStorage[key];
         if (!data || data === "null") {
             return null;
         }
         return JSON.parse(data).value;
 
     },
     setSession: function(key, value) {
         var data = {
             value: value
         }
         sessionStorage[key] = JSON.stringify(data);
     },
     getCurrentTimeStamp: function() {
         return Date.parse(new Date());
         co      },
     setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        console.info(cname + "=" + '111' + "; " + expires);
        document.cookie = cname + "=" + cvalue + "; " + expires;
     },
     //获取cookie
     getCookie: function (cname) {
        var arr, reg = new RegExp("(^| )" + cname + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
 }
 export default storage;