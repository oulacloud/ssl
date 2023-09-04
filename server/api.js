const { json } = require('express');
const mysql = require('mysql');
const dbConfig = require('./db');
const sqlMap = require('./sqlMap');

const pool = mysql.createPool({
    host: dbConfig.mysql.host,
    user: dbConfig.mysql.user,
    password: dbConfig.mysql.password,
    database: dbConfig.mysql.database,
    port: dbConfig.mysql.port,
    multipleStatements: true // 多语句查询
});
module.exports = {
    // 登录查询
    loginPage(req, res, next) {
        let loginType = req.query.loginType
        // 登录接口
        if (loginType == "login"){
            let login_username = req.query.login_username;
            let login_password = req.query.login_password;
            pool.getConnection((err, connection) => {
                var sql = sqlMap.login;
                connection.query(sql, [login_username, login_password], (err, result) => {
                    connection.release();
                    let state = {};
                    if (result.length > 0) {
                        state.state = result;
                        res.json(state);
                    } else {
                        state.state = 0;
                        res.json(state);
                    }
                })
            })
        }
        // 找回密码，返回查询结果判断用户名和手机号
        else if (loginType == "findPass"){
            let find_userName = req.query.find_userName;
            let find_phone = req.query.find_phone;
            pool.getConnection((err, connection) => {
                var sql = sqlMap.findPass;
                connection.query(sql, [find_userName, find_phone], (err, result) => {
                    connection.release();
                    let state = {}
                    // 返回结果不为空，即结果正确，返回1
                    if (result.length > 0) {
                        state.state = 1;
                        res.json(state);
                    } else {
                        state.state = 0;
                        res.json(state);
                    }
                })
            })
        }
        // 查询结果判断用户名和手机号正确，修改密码
        else if (loginType == "savePass"){
            let find_userName = req.query.find_userName;
            let find_newpassword = req.query.find_newpassword;
            pool.getConnection((err, connection) => {
                var sql = sqlMap.savePass;
                connection.query(sql, [find_newpassword, find_userName], (err, result) => {
                    connection.release();
                    let state = {}
                    if (result != null) {
                        state.state = 1;
                        res.json(state);
                    } else {
                        state.state = 0;
                        res.json(state);
                    }
                })
            })
        }
        // 注册用户
        else if (loginType == "resUser"){
            let res_username = req.query.res_username;
            let res_password = req.query.res_password;
            let res_phone = req.query.res_phone;
            let res_email = req.query.res_email;
            let res_power = req.query.res_power;
            pool.getConnection((err, connection) => {
                var sqlinsert = sqlMap.resUser;
                var sqlcheck = sqlMap.checkName;
                // 检查用户名，result长度不为0，即用户名存在，返回0
                connection.query(sqlcheck, [res_username], (err, result) => {
                    let state = {};
                    if (result.length > 0) {
                        state.state = 0;
                        res.json(state);
                    } else {
                        connection.query(sqlinsert, [res_username, res_password,res_phone,res_power,res_email], (err, result) => {
                            connection.release();
                            let state = {}
                            if (result != null) {
                                state.state = 1;
                                res.json(state);
                            } else {
                                state.state = 2;
                                res.json(state);
                            }
                        })
                    }
                })
            })
        }
    },
    // 个人中心修改信息
    modusermess(req, res, next) {
        let id = req.query.id;
        let username = req.query.username;
        let password = req.query.password;
        let phone = req.query.phone;
        let email = req.query.email;
        pool.getConnection((err, connection) => {
            var sql = sqlMap.modUsermess;
            var checksql = sqlMap.checkName;
            // if (err) {
            //     console.log("数据库连接失败")
            // } else {
            //     console.log("数据库连接成功")
            // }
            // 先查询username是否存在
            connection.query(checksql, [username], (err, result) => {
                // connection.release();
                let state = {};
                if (result.length > 0) {
                    state.state = 0;
                    res.json(state);
                } else {
                    connection.query(sql, [username, password, phone, email, id], (err, result) => {
                        connection.release();
                        let state = {};
                        if (result != null) {
                            state.state = 1;
                            res.json(state);
                        } else {
                            state.state = 2;
                            res.json(state);
                        }
                    })
                }
            })
        })
    },
    // 查询所有用户
    userlist(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.selectUsers;
            connection.query(sql, (err, result) => {
                // console.log(JSON.stringify(result))
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    // console.log(state)
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 编辑更新用户信息
    editusermess(req, res, next) {
        let username = req.query.username
        let phone = req.query.phone
        let email = req.query.email
        pool.getConnection((err, connection) => {
            var sql = sqlMap.editUsermess;
            connection.query(sql, [phone, email, username], (err, result) => {
                connection.release();
                let state = {};
                if (result != null) {
                    state.state = 1;
                    // console.log(state)
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 删除用户
    deleteuser(req, res, next) {
        let username = req.query.username
        pool.getConnection((err, connection) => {
            var sql = sqlMap.deleteUser
            connection.query(sql, [username], (err, result) => {
                connection.release();
                let state = {}
                if (result != null) {
                    state.state = 1;
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 查询要编辑的用户信息，显示在修改界面
    searchusername(req, res, next) {
        let username = req.query.username
        pool.getConnection((err, connection) => {
            var sql = sqlMap.checkName;
            connection.query(sql, [username], (err, result) => {
                connection.release();
                let state = {};
                if (result.length > 0) {
                    state.state = result;
                    // console.log(state)
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 添加用户
    adduser(req, res, next) {
        let username = req.query.username
        let password = req.query.password
        let phone = req.query.phone
        let email = req.query.email
        let power = req.query.power
        pool.getConnection((err, connection) => {
            var sql = sqlMap.insertuser;
            var checksql = sqlMap.checkName
            connection.query(checksql, [username], (err, result) => {
                let state = {};
                if (result.length > 0) {
                    state.state = 0;
                    res.json(state);
                } else {
                    connection.query(sql, [res_username, res_password,res_phone,res_power,res_email], (err, result) => {
                        connection.release();
                        let state = {}
                        console.log(result)
                        if (result != null) {
                            state.state = 1;
                            res.json(state);
                        } else {
                            state.state = 0;
                            res.json(state);
                        }
                    })
                }
            })
        })
    },
    // 查询所有用户
    shoplist(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.selectshops;
            connection.query(sql, (err, result) => {
                // console.log(JSON.stringify(result))
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    // console.log(state)
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 注册插入用户表
    resuser(req, res, next) {
        let username = req.query.username
        let password = req.query.password
        let phone = req.query.phone
        let email = req.query.email
        let power = req.query.power
        pool.getConnection((err, connection) => {
            var sql = sqlMap.insertresuser;
            var checksql = sqlMap.checkName;
            var checkressql = sqlMap.checkresName;
            var checkphone = sqlMap.checkPhone;
            let state = {};
            connection.query(checksql, [username], (err, result) => {
                if (result.length > 0) {
                    state.state = 0;
                    res.json(state);
                } else {
                    connection.query(checkressql, [username], (err, result) => {
                        if (result.length > 0) {
                            state.state = 0;
                            res.json(state);
                        } else {
                            connection.query(checkphone, [phone], (err, result) => {
                                if (result.length > 0) {
                                    state.state = 1;
                                    res.json(state);
                                } else {
                                    connection.query(sql, [username, password, phone, power, email], (err, result) => {
                                        connection.release();
                                        if (result == null) {
                                            state.state = 1;
                                            res.json(state);
                                        } else {
                                            state.state = 3;
                                            res.json(state);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })
    },
    // 查询所有待批准用户表
    reslist(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.selectresusers;
            connection.query(sql, (err, result) => {
                // console.log(JSON.stringify(result))
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    // console.log(state)
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 查询货款数据
    daikuanlist(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.selectDaikuan;
            connection.query(sql, (err, result) => {
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 查询贷款年月
    daikuanym(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.selectDisdaikuany;
            var sql2 = sqlMap.selectDisdaikuanm;
            var sqla = sql + ';' + sql2 + ';';
            connection.query(sqla, (err, result) => {
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 查询商品房数据
    shangpinfanglist(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.selectShangpinfang;
            connection.query(sql, (err, result) => {
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 房价计算同环比
    fangjiacount(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.fangjiaCount;
            connection.query(sql, (err, result) => {
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 房价全国信息
    fangjiacountd(req, res, next) {
        let mind = req.query.mind;
        let maxd = req.query.maxd;
        pool.getConnection((err, connection) => {
            var sql = sqlMap.fangjiaCountd;
            connection.query(sql,[mind,maxd], (err, result) => {
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
    // 查询房价城市信息
    fangjiacountcd(req, res, next) {
        pool.getConnection((err, connection) => {
            var sql = sqlMap.selectDisfangjiacity;
            var sql2 = sqlMap.selectfangjiacountc;
            var sqla = sql + ';' + sql2 + ';';
            connection.query(sqla, (err, result) => {
                connection.release();
                let state = [];
                if (result.length > 0) {
                    state = result;
                    res.json(state);
                } else {
                    state.state = 0;
                    res.json(state);
                }
            })
        })
    },
}