async function main(){
    // 注意引入swc文件路径。
    await require(`${__dirname}/kekev2/swc`)({
        config : require(`${__dirname}/conf/config.test.json`)
    });
    let swc = global.swc;
    
    // mysql 模块载入
    await swc.registerMysqlDao({
		path : `${__dirname}/services/http/httpDao/mysql.js`
    });
    
    // 中间件
    await swc.registerMiddleware({
        path : `${__dirname}/services/http/middlewares/getUser`,
        moduleName : 'getUser'
    })

    // http 服务
    await swc.registerHttpService({
        httpServiceFilePath : `${__dirname}/services/http/httpModule`
    })
    
    // 静态页面
    await swc.registerStatic({
		items : [{
			path : `/${swc.config.httpServer.bussinessName}/public/library`,
			staticFilePath : `${__dirname}/public/library`
		}, {
			path : `/${swc.config.httpServer.bussinessName}/public/main`,
			staticFilePath : `${__dirname}/public/main`
		}]
	});

    await swc.services.http.startup();
    
}
main();