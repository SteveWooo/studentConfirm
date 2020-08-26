window.swc = {
    http : {
        resHandle : function(res){
            if (res.code != 2000) {
                alert(res.message || res.error_message);
                return false;
            }
            return true;
        }
    },
    ls : {
        set : function(key, value){
            localStorage.setItem(key, value);
        },
        get : function(key){
            return localStorage.getItem(key);
        }
    },
}