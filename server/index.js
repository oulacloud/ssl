const routerApi = require('./router');
const bodyParser = require('body-parser'); // post 数据需要
const express = require('express');
const app = express();

app.use(bodyParser.json());

// 后端api路由
app.use('/api', routerApi);
// 全局监听返回错误是服务继续
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});
// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');