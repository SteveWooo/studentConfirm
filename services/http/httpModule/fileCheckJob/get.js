module.exports = {
	config : {
		path : '/api/file_check_job/get',
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
		let file_check_job_id = query.file_check_job_id;
		// 处理翻页
		if (!query.page) {
			query.page = 1;
		}
		if (!query.item_per_page) {
			query.item_per_page = 300;
		}

		// 拉列表
		if (!file_check_job_id || file_check_job_id.length != 40) {
			req.response = await swc.Error({
				code: 4003
			})
			next();
			return ;
		}

		let job = await swc.dao.models.file_check_jobs.findAndCountAll({
			where : {
				file_check_job_id : file_check_job_id,
				status : 1,
			}
		})
		if (job.count == 0) {
			req.response = await swc.Error({
				code : 4004,
				message : "链接已失效，请链系管理员"
			});
			next();
			return ;
		}

		let conditions = {
			file_check_job_id : file_check_job_id,
			status : 1
		}

		// 如果是自己创建的任务，就能看全部
		if (source.user_id == job.rows[0].create_by && query.all == 1) {
			
		} else {
			conditions.id_num = source.id_num
		}

		let detailJobs = await swc.dao.models.file_checks.findAndCountAll({
			where : conditions,
			include : [{
				as : "user",
				model : swc.dao.models.users
			}],
			order : [["create_at", "DESC"]],
			limit : query.item_per_page,
			offset : (query.page - 1) * query.item_per_page
		})

		for(let i=0;i<detailJobs.rows.length;i++) {
			// detailJobs.rows[i].data = "***"
		}

		req.response.file_check_job = job.rows[0];
		req.response.file_check_list = detailJobs.rows;
		next();
		return ;
	}
}