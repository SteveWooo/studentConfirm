Vue.component("file_check_job_create_page", {
    data : function(){
        return {
            form : {
                fileData : {},
            },
            config : {
                idNumColName : "身份证", // 自定义
                titleLine : 1,
                password : "",
                iv : "12345678" // 先写死
            },
            fileReader : undefined,
            file : undefined
        }
    },
    methods : {
        create : function(){
            this.fileReader.readAsBinaryString(this.file[0]);
        },
        submit : function(){
            var that = this;
            var form = this.form;
            console.log(form);
            // $.ajax({
            //     url : global.config.baseUrl + "/" + global.config.bussinessName + "/api/user/change_password",
            //     method : "post",
            //     headers : {
            //         "Content-Type" : "Application/json"
            //     },
            //     data : JSON.stringify(form),
            //     success : function(res){
            //         if (!swc.http.resHandle(res)){
            //             return ;
            //         }
            //     }
            // })
        },
    },
    mounted : function(){
        var that = this;

        // AES加密
        function encryptoAES(data, key, iv) {
            var tempKey = CryptoJS.enc.Utf8.parse(key);
            var tempIv = CryptoJS.enc.Utf8.parse(iv);
            var secretData = CryptoJS.AES.encrypt(data, tempKey, {
                iv: tempIv, 
                mode: CryptoJS.mode.CBC, 
                padding: CryptoJS.pad.Pkcs7
            });
            // return secretData.toString();
            return secretData.toString();
        }

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

        $('#file_check_job_create-file').change(function(e) {
            that.file = e.target.files;
            that.fileReader = new FileReader();
            var data, workbook;
            that.fileReader.onload = function(ev) {
                try {
                    data = ev.target.result;
                    workbook = XLSX.read(data, {
                        type : 'binary'
                    })
                }catch(e) {
                    console.log(e)
                    console.log("file type error");
                }

                // 记录整个表格的加密信息。
                var postData = {};
                // 生成密码
                that.config.password = CryptoJS.lib.WordArray.random(2).toString();

                var sheet = workbook.Sheets["Sheet1"];
                var sheetJson = XLSX.utils.sheet_to_json(sheet);
                for (var i=that.config.titleLine-1;i<sheetJson.length;i++) {
                    var idNum = sheetJson[i][that.config.idNumColName];
                    // console.log(idNum);
                    var dataStr = JSON.stringify(sheetJson[i]);
                    // console.log(dataStr)
                    var secretData = encryptoAES(dataStr, that.config.password, that.config.iv);
                    // console.log(secretData);
                    // var originData = decryptoAES(secretData, that.config.password, that.config.iv); // 解密获取原字符串的方式
                    // console.log(originData);

                    postData[idNum] = secretData;
                }

                that.form.fileData = postData;
                // console.log(postData);
            }
            // fileReader.readAsBinaryString(file[0]);
        })
    },
    template : `
    <v-container>
        <v-layout row wrap>
            <v-row xs12>
                填写信息
            </v-row>
        </v-layout>
        <div style="margin-top:20px;">
            <input type="text" v-model="config.idNumColName" placeholder="身份证列名称*">
            <input type="file" id="file_check_job_create-file">
            <v-btn @click="create">构造excel信息</v-btn>
            <v-btn @click="submit">提交</v-btn>
        </div>
        <div v-if="config.password.length != 0">
            生成密码：{{config.password}}
        </div>
        <div v-if="config.password.length != 0">
            总信息数：{{Object.keys(form.fileData).length}}
        </div>
        <div v-if="config.password.length != 0">
           <div v-for="(value, key) in form.fileData">
                {{key}} : {{value}}
           </div>
        </div>
    </v-container>
    `
})