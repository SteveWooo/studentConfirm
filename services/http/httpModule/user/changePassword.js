const crypto = require('crypto');
function hash(msg) {
	return crypto.createHash('sha1').update(msg).digest('hex');
}

function User(info){
	var swc = global.swc;
	let user_id = hash(info.id_num + swc.config.salt);
	let now = +new Date();

	let passwordHash = hash(info.password + swc.config.salt);

	let session = hash(passwordHash + info.id_num + now + swc.config.salt);

	this.user_id = user_id;
	this.password = passwordHash;
	this.id_num = info.id_num;
	this.phone = "";
	this.email = "";
	this.create_by = user_id;
	this.update_by = user_id;
	this.create_at = now;
	this.update_at = now;
	this.session = session;

	this.nick_name = info.nick_name

	return this;
}
module.exports = {
	config : {
		path : '/api/user/change_password',
		method : 'post',
		middlewares : [],
		model : {
			code : 2000,
			error_message : '',
			session : undefined
		}
	},
	service : async (req, res, next)=>{
		var query = req.body;
		var swc = global.swc;

		let id_num = query.id_num;
		let nick_name = query.nick_name;
		let now = +new Date();

		if (!id_num || id_num.length != 18 || !nick_name || nick_name.length > 8) {
            req.response = await swc.Error({
				code : 4005,
				message : "身份证号或昵称输入错误"
            })
            next();
            return ;
		}
		// 如果用户存在，那就要输入原密码才能修改密码
		let user = await swc.dao.models.users.findAndCountAll({
			where : {
				id_num : id_num
			}
		})

		// 检查原密码。
		if (user.count != 0) {
			let oldPassword = query.old_password;
			if (!oldPassword) {
				req.response = await swc.Error({
					code : 4003
				});
				next();
			}
			let hashPass = hash(oldPassword + swc.config.salt);
			if (hashPass != user.rows[0].password) {
				req.response = await swc.Error({
					code : 4003
				});
				next();
				return ;
			}
		}
		
		if (!query.password || query.password.length < 6 || query.password.length > 18) {
			req.response = await swc.Error({
				code : 4005,
				message : "密码长度必须为6到18位之间"
            })
            next();
            return ;
		}

		if (query.password != query.password_confirm) {
			req.response = await swc.Error({
				code : 4005,
				message : "两次密码不一致"
            })
            next();
            return ;
		}

		let newUser = new User({
			nick_name : nick_name,
			password : query.password,
			id_num : id_num
		})

		// 用户存在，修改密码。用户不存在，创建用户
		if (user.count != 0) {
			await user.rows[0].update({
				password : newUser.password,
				session : newUser.session
			})
		} else {
			await swc.dao.models.users.create(newUser);
		}

		req.response.session = newUser.session;

		next();
	}
}