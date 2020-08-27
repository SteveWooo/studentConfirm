Vue.component("file_check_job_list_page", {
    data : function(){
        return {
            fileCheckJob : {
                job : {},
                list : [],
            },
            linkPanel : {
                show : false,
                file_check_job_id : ""
            }
        }
    },
    methods : {
        doDelete : function(fileCheckJob){
            if (!confirm('确认删除?')) {
                return ;
            }
            var that = this;
            var form = this.form;
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/file_check_job/delete?session=" + swc.ls.get("session") + 
                "&file_check_job_id=" + fileCheckJob.file_check_job_id,
                method : "get",
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }

                    alert("删除成功");
                    that.refresh();
                }
            })
        },
        refresh : function(){
            var that = this;
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/file_check_job/get_list?session=" + swc.ls.get("session"),
                method : "get",
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }
                    that.fileCheckJob.list = res.file_check_job;
                }
            })
        },

        getLink : function(item) {
            this.linkPanel.file_check_job_id = item.file_check_job_id;
            this.linkPanel.show = true;
        },

        toDetail : function(item){
            global.param.file_check_job_id = item.file_check_job_id;
            location.hash='file_check_job_detail_page';
        }
    },
    mounted : function(){
        this.refresh();
    },
    template : `
    <v-container>
        <v-layout row wrap>
            <v-flex xs8>
            </v-flex>
            <v-flex xs4>
                <v-btn small @click="location.hash='file_check_job_create_page'">
                    创建文件检查任务
                </v-btn>
            </v-flex>
        </v-layout>
        <div>
            <h4>我创建的文件检查任务：</h4>
        </div>
        <div style="margin-top:20px;">
            <div v-for="item in fileCheckJob.list" style="border-bottom : 1px solid #111;width:90%">
            <v-layout row wrap>
                <v-flex xs8>
                    <div @click="toDetail(item)">{{item.file_check_name}}</div>
                </v-flex>
                <v-flex xs4>
                    <v-btn color="blue" style="color:#fff" small @click="getLink(item)">获取分享链接</v-btn>
                    <v-btn color="red" style="color:#fff" small @click="doDelete(item)">删除</v-btn>
                </v-flex>
            </v-layout>
            </div>
        </div>
        
        <v-dialog 
            dark
            scrollable=true
            hide-overlay="true"
            v-model="linkPanel.show"
            width=1000
            height=1000
            >
            <v-card>
                <v-card-title
                class="headline blue lighten-1"
                primary-title
                >
                    分享以下链接
                </v-card-title>
                <div style="height:100px;line-height:100px">
                    <div style="width: 100%;margin-left:5%;height:40px;line-height:40px;size:28px;word-wrap:break-all">
                        {{location.origin}}/{{global.config.bussinessName}}/public/main/file_check.html?file_check_job_id={{linkPanel.file_check_job_id}}
                    </div>
                </div>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn
                        @click="linkPanel.show = false">
                        关闭
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
    `
})