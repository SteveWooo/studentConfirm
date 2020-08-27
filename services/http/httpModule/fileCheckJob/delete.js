module.exports = {
	config : {
		path : '/api/file_check_job/delete',
		method : 'get',
		middlewares : ["getUser"],
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
        let now = +new Date();
        if (!file_check_job_id) {
            req.response = await swc.Error({
                code : 4003
            });
            next();
            return ;
        }
        let fileCheckJob = await swc.dao.models.file_check_jobs.findAndCountAll({
            where : {
                file_check_job_id : file_check_job_id,
                create_by : source.user_id
            }
        })

        if (fileCheckJob.count == 0) {
            req.response = await swc.Error({
                code : 4003
            });
            next();
            return ;
        }

        await fileCheckJob.rows[0].update({
            status : 0,
            update_at : now,
            update_by : source.user_id
        })

        let fileChecks;
        page = 1;

        while(true) {
            fileChecks = await swc.dao.models.file_checks.findAndCountAll({
                where : {
                    file_check_job_id : file_check_job_id,
                    create_by : source.user_id
                },
                limit : 100,
			    offset : (page - 1) * 100
            })
            if (fileChecks.rows.length == 0) {
                break;
            }

            for(let i=0;i<fileChecks.rows.length;i++) {
                await fileChecks.rows[i].update({
                    status : 0,
                    update_at : now,
                    update_by : source.user_id
                })
            }

            page ++;
        }

        next();
	}
}