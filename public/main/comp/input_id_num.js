Vue.component("input_id_num_page", {
    data : function(){
        return {
            form : {
                id_num : ""
            }
        }
    },
    methods : {
        submit : function(){
            var that = this;
            var form = this.form;
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/user/check_exists?id_num=" + form.id_num,
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }
                    
                    if (res.is_exists == true) {
                        location.hash = "login_page";
                    } else {
                        location.hash = "change_password_page";
                    }
                }
            })
        },
    },
    mounted : function(){
        var that = this;
        var session = swc.ls.get("session");
        if (!session) {
            return ;
        }
        $.ajax({
            url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/user/get?session=" + session,
            success : function(res){
                if (!swc.http.resHandle(res)){
                    return ;
                }
                if (res.is_exists == true) {
                    swc.ls.set("user", JSON.stringify(res.user));
                    location.hash = global.bussiness.login_success_page;
                    return ;
                }

                
            }
        })
        
    },
    template : `
    <v-container>
        <div style="margin-top:20px;">
            <input type="text" v-model="form.id_num" placeholder="身份证号">
            <v-btn @click="submit">提交</v-btn>
        </div>
    </v-container>
    `
})