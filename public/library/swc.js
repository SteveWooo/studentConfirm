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
    getQuery : function(variable){
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
        }

        return undefined;
    },
}