Vue.component("file_check_page", {
    data : function(){
        return {
            file_check_job_id : '',
            job : {},
            myDetail : [],

            password : '',
            decryptoData : undefined,

            loaded : false
        }
    },
    methods : {
        refresh : function(){
            var that = this;
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/file_check_job/get?session=" + swc.ls.get("session") + 
                    "&file_check_job_id=" + that.file_check_job_id,
                method : "get",
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }
                    that.job = res.file_check_job;
                    that.myDetail = res.file_check_list;
                    that.loaded = true;
                }
            })
        },

        decrypto : function(){
            var data;
            var that = this;
            // AES解密
            function decryptoAES(secretData, key, iv) {
                var tempKey = CryptoJS.enc.Utf8.parse(key);
                var tempIv = CryptoJS.enc.Utf8.parse(iv);
                var originData = CryptoJS.AES.decrypt(secretData, tempKey, {
                    iv: tempIv, 
                    mode: CryptoJS.mode.CBC, 
                    padding: CryptoJS.pad.Pkcs7
                });
                return originData.toString(CryptoJS.enc.Utf8);
            }
            
            try {
                data = decryptoAES(this.myDetail[0].data, this.password, global.bussiness.crypto.iv);
                data = JSON.parse(data);
            }catch(e) {
                alert("解压失败，请输入正确密码")
                that.decryptoData = undefined;
            }
            this.decryptoData = data;
        },

        checkPass : function(){
            var that = this;
            if(!confirm('确定信息无误？')) {
                return ;
            }

            // check
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/file_check_job/check?session=" + swc.ls.get("session") + 
                    "&file_check_job_id=" + that.file_check_job_id + 
                    "&file_check_id=" + that.myDetail[0].file_check_id + 
                    "&file_check_status=1",
                method : "get",
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }
                    alert("提交成功");
                    location.reload()
                }
            })
        },

        checkUnPass : function(){
            var that = this;
            let checkMessage = prompt("请描述信息存在的问题");

            // check no pass
            $.ajax({
                url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/file_check_job/check?session=" + swc.ls.get("session") + 
                    "&file_check_job_id=" + that.file_check_job_id + 
                    "&file_check_id=" + that.myDetail[0].file_check_id + 
                    "&check_message=" + checkMessage + 
                    "&file_check_status=2",
                method : "get",
                success : function(res){
                    if (!swc.http.resHandle(res)){
                        return ;
                    }
                    alert("提交成功");
                    location.reload()
                }
            })
        },

        relogin : function(){
            swc.ls.set("session", undefined);
            swc.ls.set("user", undefined);
            location.hash='input_id_num_page';
        }
    },
    mounted : function(){
        this.file_check_job_id = swc.getQuery("file_check_job_id");
        this.refresh();
    },
    template : `
    <v-container>
        <v-layout row wrap>
            <v-flex xs8>
                <v-btn small @click="relogin">
                    重新登录
                </v-btn>
            </v-flex>
            <v-flex xs4>
            </v-flex>

            <v-flex xs12 v-if="loaded == true && myDetail.length == 0">
                <div style="color:red">
                    文件中找不到你的身份证号码，请与管理员核对。（当前帐号身份证号为：{{JSON.parse(swc.ls.get("user")).id_num}}）
                </div>
            </v-flex>

            <v-flex xs12 v-if="loaded == true && myDetail.length == 0">
                <div style="color:red">
                    文件中找不到你的身份证号码，请与管理员核对。（当前帐号身份证号为：{{JSON.parse(swc.ls.get("user")).id_num}}）
                </div>
            </v-flex>

            <v-flex xs12 v-if="loaded == true && myDetail.length != 0">
                <span>请输入解压密码：<span>
                <input type="text" v-model="password">
                <v-btn @click="decrypto">解压</v-btn>
            </v-flex>

            <v-flex xs12 v-if="loaded == true && myDetail.length != 0 && decryptoData != undefined">
                <div v-for="(value, key) in decryptoData">
                    {{key}} : {{value}}
                </div>
                <div>
                    <v-btn color="blue" style="color:#fff" @click="checkPass">
                        检查通过
                    </v-btn>

                    <v-btn color="red" style="color:#fff" @click="checkUnPass">
                        信息有误
                    </v-btn>
                </div>
                <div>
                    校对情况：{{myDetail[0].file_check_status == 0 ? '待校对' : myDetail[0].file_check_status == 1 ? '信息无误' : '信息有错'}}
                </div>
            </v-flex>

        </v-layout>
        
    </v-container>
    `
})