const crypto = require('crypto');
function hash(msg) {
	return crypto.createHash('sha1').update(msg).digest('hex');
}

function FileCheck(fileCheckJob, idNum, data){
	var swc = global.swc;
	let now = +new Date();
	var fileCheckId = hash(fileCheckJob.file_check_job_id + idNum + data + now + swc.config.salt);

	this.file_check_id = fileCheckId;
	this.file_check_job_id = fileCheckJob.file_check_job_id;
	this.data = data;
	this.id_num = idNum;

	this.status = 1;
	this.file_check_status = 0; // 待审查

	this.create_by = fileCheckJob.create_by;
	this.update_by = fileCheckJob.update_by;
	this.create_at = now;
	this.update_at = now;
}

function FileCheckJob(query, source){
	var swc = global.swc;
	let now = +new Date();
	let file_check_job_id = hash(JSON.stringify(query.fileData) + query.file_check_name + now + swc.config.salt);

	this.file_check_job_id = file_check_job_id;
	this.file_check_name = query.file_check_name;

	this.file_type = "excel"; // 默认，目前唯一支持excel，这个作为保留字段。

	this.status = 1;

	this.create_by = source.user_id;
	this.update_by = source.user_id;
	this.create_at = now;
	this.update_at = now;

	return this;
}
module.exports = {
	config : {
		path : '/api/file_check_job/create',
		method : 'post',
		middlewares : ['getUser'],
		model : {
			code : 2000,
			error_message : '',
			data : {}
		}
	},
	service : async (req, res, next)=>{
		var query = req.body;
		var swc = global.swc;

		if (!query.file_check_name || query.file_check_name.length > 100) {
			req.response = await swc.Error({
				code : 4003
			});
			next();
			return ;
		}

		if (typeof query.file_data != 'object') {
			req.response = await swc.Error({
				code : 4003,
				message : '文件格式错误'
			});
			next();
			return ;
		}

		// 先创建file check job
		let fileCheckJob = new FileCheckJob(query, req.response.source);
		let fileCheckJobResult = await swc.dao.models.file_check_jobs.create(fileCheckJob);

		if (!fileCheckJobResult) {
			req.response = await swc.Error({
				code : 5000,
				message : '检查任务创建失败'
			});
			next();
			return ;
		}

		// 逐条创建file_check，如果id_num和file_check_job_id键对搜索出来的是存在的，就更新data
		for (let idNum in query.file_data) {
			let data = query.file_data[idNum];
			let fileCheck = new FileCheck(fileCheckJob, idNum, data);
			await swc.dao.models.file_checks.create(fileCheck);
		}

        next();
	}
}