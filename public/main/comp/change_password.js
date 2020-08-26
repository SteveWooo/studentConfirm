Vue.component("change_password_page", {
    data : function(){
        return {
            form : {
                id_num : "",
                password : "",
                password_confirm : "",
                nick_name : ""
            }
        }
    },
    methods : {
        submit : function(){
            var that = this;
            var form = this.form;
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/user/change_password",
                method : "post",
                headers : {
                    "Content-Type" : "Application/json"
                },
                data : JSON.stringify(form),
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }
                    swc.ls.set("session", res.session);
                    location.hash = global.bussiness.init_page;
                }
            })
        },
    },
    mounted : function(){
        
    },
    template : `
    <v-container>
        <div style="margin-top:20px;">
            <input type="text" v-model="form.id_num" placeholder="身份证号">
            <input type="text" v-model="form.nick_name" placeholder="昵称">
            <input type="text" v-model="form.password" placeholder="密码"> 
            <input type="text" v-model="form.password_confirm" placeholder="确认密码">
            <v-btn @click="submit">提交</v-btn>
        </div>
    </v-container>
    `
})