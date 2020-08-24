const crypto = require('crypto');
function hash(msg) {
	return crypto.createHash('sha1').update(msg).digest('hex');
}
module.exports = {
	config : {
		path : '/api/user/login',
		method : 'get',
		middlewares : [],
		model : {
			code : 2000,
			error_message : '',
			session : undefined
		}
	},
	service : async (req, res, next)=>{
		var query = req.query;
		var swc = global.swc;

		let id_num = query.id_num;
		let password = query.password;
		let user = await swc.dao.models.users.findAndCountAll({
			where : {
				id_num : id_num
			}
		})
		if (user.count == 0) {
			req.response = await swc.Error({
				code : 4003
			});
			next();
			return ;
		}

		let hashPass = hash(password + swc.config.salt);
		if (hashPass != user.rows[0].password) {
			req.response = await swc.Error({
				code : 4003
			});
			next();
			return ;
		}

		let now = +new Date();
		let session = hash(password + id_num + now + swc.config.salt);

		await user.rows[0].update({
			session : session
		})

		req.response.session = session;
		next();
	}
}