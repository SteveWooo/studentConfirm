Vue.component("file_check_job_detail_page", {
    data : function(){
        return {
            fileCheckJob : {
                job : {},
                detail : [],
            }
        }
    },
    methods : {
        refresh : function(){
            var that = this;
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/file_check_job/get?session=" + swc.ls.get("session") + 
                    "&file_check_job_id=" + global.param.file_check_job_id,
                method : "get",
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }
                    console.log(res);
                    that.fileCheckJob.job = res.file_check_job;
                    that.fileCheckJob.detail = res.file_check_list;
                }
            })
        }
    },
    mounted : function(){
        this.refresh();
    },
    template : `
    <v-container>
        <v-layout row wrap>
            <v-flex xs8>
                <v-btn small @click="location.hash='file_check_job_list_page'">
                    返回
                </v-btn>
            </v-flex>
            <v-flex xs4>
            </v-flex>
        </v-layout>
        <div>
            <h4>文件参与者：</h4>
        </div>
        <div style="margin-top:20px;">
            <div style="border-bottom : 1px solid #eee;width:90%">   
                <v-layout row wrap>
                    <v-flex xs4>
                        <div >身份证号码</div>
                    </v-flex>
                    <v-flex xs2>
                        <div >检查状态</div>
                    </v-flex>

                    <v-flex xs6>
                        <div >留言</div>
                    </v-flex>
                </v-layout>
            </div>
            <div v-for="item in fileCheckJob.detail" style="border-bottom : 1px solid #111;width:90%;height:40px;line-height:40px">
                <v-layout row wrap>
                    <v-flex xs4>
                        <div >{{item.id_num}}</div>
                    </v-flex>
                    <v-flex xs2>
                        <div>{{item.file_check_status == 0 ? '待检查' : (item.file_check_status == 1 ? '确认' : '信息有误')}}</div>
                    </v-flex>

                    <v-flex xs6>
                        <div >{{item.check_message}}</div>
                    </v-flex>
                </v-layout>
            </div>
        </div>
    </v-container>
    `
})