async function getUser(req, res, next){
	let swc = global.swc
	let session = req.query.session;
	if (session == undefined) {
		res.send(JSON.stringify(await swc.Error({
			code : 4003
		})))
		return ;
	}

	let user = await swc.dao.models.users.findAndCountAll({
		where : {
			session : session
		}
	})

	if (user.count == 0) {
		res.send(JSON.stringify(await swc.Error({
			code : 4003,
			message : "session无效"
		})))
		return ;
	}

	req.response.source = {
		user_id : user.rows[0].user_id,
		id_num : user.rows[0].id_num
	}

	next();
}

module.exports = getUser