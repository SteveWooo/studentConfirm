const Sequelize = require("sequelize");
exports.defineModel = async function defineModel(){
    let swc = global.swc
	swc.dao.models.users = swc.dao.seq.define("users", {
		user_id : {type : Sequelize.STRING(40)}, //唯一ID
		nick_name : {type : Sequelize.TEXT}, //昵称
		email : {type : Sequelize.TEXT}, // 邮箱
		password : {type : Sequelize.STRING(40)}, // 密码哈希
		phone : {type : Sequelize.STRING(13)}, // 手机号
		id_num : {type : Sequelize.STRING(18)}, // 身份证号

		session : {type : Sequelize.STRING(40)}, // 登录凭证

		create_by : {type : Sequelize.STRING(40)},
		update_by : {type : Sequelize.STRING(40)},
		create_at : {type : Sequelize.STRING(13)},
		update_at : {type : Sequelize.STRING(13)},
	})

	swc.dao.models.file_check_jobs = swc.dao.seq.define("file_check_jobs", {
		file_check_job_id : {type : Sequelize.STRING(40)}, //唯一ID
		file_check_name : {type : Sequelize.TEXT}, // 文件检查任务名
		
		file_type : {type : Sequelize.TEXT}, // 文件类型，默认excel。目前只支持excel

		status : {type : Sequelize.INTEGER}, // 0代表删除，1代表正常

		create_by : {type : Sequelize.STRING(40)},
		update_by : {type : Sequelize.STRING(40)},
		create_at : {type : Sequelize.STRING(13)},
		update_at : {type : Sequelize.STRING(13)},
	})
	
	swc.dao.models.file_checks = swc.dao.seq.define("file_checks", {
		file_check_id : {type : Sequelize.STRING(40)}, //唯一ID
		file_check_job_id : {type : Sequelize.STRING(40)}, // file唯一ID
		id_num : {type : Sequelize.STRING(18)}, // 用户ID

		data : {type : Sequelize.TEXT}, // 加密数据，需要用户前端用密码解密

		status : {type : Sequelize.INTEGER}, // 0代表删除，1代表正常

		file_check_status : {type : Sequelize.INTEGER}, // 状态，0待确认，1确认，2有错误。
		check_message : {type : Sequelize.TEXT}, // 用户反馈的错误信息

		create_by : {type : Sequelize.STRING(40)},
		update_by : {type : Sequelize.STRING(40)},
		create_at : {type : Sequelize.STRING(13)},
		update_at : {type : Sequelize.STRING(13)},
	})
    global.swc = swc;
	return {};
}

exports.defineIndex = async function defineIndex(){
    let swc = global.swc;
	// swc.dao.models.demos.belongsTo(swc.dao.models.users, {
	// 	foreignKey : 'create_by', // 数量多的一个数据实体，比如用户发的新闻数据
	// 	targetKey : 'admin_id', // 数量少的一个数据实体，比如用户
	// 	as : 'admin'
	// })

	swc.dao.models.file_check_jobs.belongsTo(swc.dao.models.users, {
		foreignKey : 'create_by', // 数量多的一个数据实体，比如用户发的新闻数据
		targetKey : 'user_id', // 数量少的一个数据实体，比如用户
		as : 'user'
	})

	swc.dao.models.file_check_jobs.belongsTo(swc.dao.models.file_checks, {
		foreignKey : 'file_check_job_id', // 数量多的一个数据实体，比如用户发的新闻数据
		targetKey : 'file_check_job_id', // 数量少的一个数据实体，比如用户
		as : 'file_check'
	})

	swc.dao.models.file_checks.belongsTo(swc.dao.models.users, {
		foreignKey : 'id_num', // 数量多的一个数据实体，比如用户发的新闻数据
		targetKey : 'id_num', // 数量少的一个数据实体，比如用户
		as : 'user'
	})

    swc.log.info('载入:数据索引');
    global.swc = swc;
	return {};
}