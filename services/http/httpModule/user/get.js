module.exports = {
	config : {
		path : '/api/user/get',
		method : 'get',
		middlewares : [],
		model : {
			code : 2000,
			error_message : '',
			is_exists : undefined
		}
	},
	service : async (req, res, next)=>{
		var query = req.query;
		var swc = global.swc;

		let session = req.query.session;

        let user = await swc.dao.models.users.findAndCountAll({
            where : {
                session : session
            }
        })
        if (user.count == 0) {
            req.response.is_exists = false;
        } else {
            req.response.is_exists = true;
            req.response.user = {
				user_id : user.rows[0].user_id,
				id_num : user.rows[0].id_num
			}
        }

        next();
	}
}