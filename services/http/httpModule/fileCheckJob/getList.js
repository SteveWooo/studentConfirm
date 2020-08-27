module.exports = {
	config : {
		path : '/api/file_check_job/get_list',
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
		// 处理翻页
		if (!query.page) {
			query.page = 1;
		}
		if (!query.item_per_page) {
			query.item_per_page = 300;
		}

		let jobs = await swc.dao.models.file_check_jobs.findAndCountAll({
            where : {
                create_by : source.user_id,
                status : 1,
            },
            order : [["create_at", "DESC"]],
            include : [{
                as : "user",
                model : swc.dao.models.users
            }],
            limit : query.item_per_page,
            offset : (query.page - 1) * query.item_per_page
        })
        for(let i=0;i<jobs.rows.length;i++ ){
            jobs.rows[i].user.password = "***"
        }
        req.response.file_check_job = jobs.rows;
        next();
        return ;
	}
}