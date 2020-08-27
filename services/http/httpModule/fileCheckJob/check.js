module.exports = {
	config : {
		path : '/api/file_check_job/check',
		method : 'get',
		middlewares : ['getUser'],
		model : {
			code : 2000,
			error_message : '',
			data : {}
		}
	},
	service : async (req, res, next)=>{
		var query = req.query;
		var swc = global.swc;
		let source = req.response.source;

		if (!query.check_message) {
			query.check_message = "";
		}

		let fileCheckStatus = query.file_check_status;
		if(fileCheckStatus != 1 && fileCheckStatus != 2) {
			req.response = await swc.Error({
				code : 4005,
				message : "发生错误，code: status"
			});
			next();
			return ;
		}

		let fileCheckJobId = query.file_check_job_id;
		if (!fileCheckJobId || fileCheckJobId.length != 40) {
			req.response = await swc.Error({
				code : 4005,
				message : "发生错误，code: filecheckjobid"
			});
			next();
			return ;
		}
		
		let fileCheckId = query.file_check_id;
		if (!fileCheckId || fileCheckId.length != 40) {
			req.response = await swc.Error({
				code : 4005,
				message : "发生错误，code: filecheckid"
			});
			next();
			return ;
		}

		let fileCheck = await swc.dao.models.file_checks.findAndCountAll({
			where : {
				id_num : source.id_num,
				file_check_job_id : fileCheckJobId,
				file_check_id : fileCheckId
			}
		})

		if (fileCheck.count == 0) {
			req.response = await swc.Error({
				code : 4004
			});
			next();
			return ;
		}

		await fileCheck.rows[0].update({
			file_check_status : fileCheckStatus,
			check_message : query.check_message
		})

		next();
	}
}