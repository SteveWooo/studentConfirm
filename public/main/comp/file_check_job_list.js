Vue.component("file_check_job_list_page", {
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
                }
            })
        },
    },
    mounted : function(){
        var that = this;
    },
    template : `
    <v-container>
        <v-layout row wrap>
            <v-row xs12>
                <v-btn @click="location.hash='file_check_job_create_page'">
                    创建文件检查任务
                </v-btn>
            </v-row>
        </v-layout>
        <div style="margin-top:20px;">
            list
        </div>
    </v-container>
    `
})