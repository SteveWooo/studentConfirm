module.exports = {
	config : {
		path : '/api/user/check_exists',
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

        let id_num = req.query.id_num;
        if (!id_num || id_num.length != 18) {
            req.response = await swc.Error({
                code : 4005
            })
            next();
            return ;
        }

        let user = await swc.dao.models.users.findAndCountAll({
            where : {
                id_num : id_num
            }
        })
        if (user.count == 0) {
            req.response.is_exists = false;
        } else {
            req.response.is_exists = true;
        }

        next();
	}
}