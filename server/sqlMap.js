module.exports = {
    // UPDATE和SELECT返回的参数类型不同
    // loginType == "login"
    login: 'SELECT * FROM user WHERE username = ? AND password = ? ',
    // loginType == "findPass"
    findPass: 'SELECT * FROM user WHERE username = ? AND phone = ?',
    // loginType == "savePass"
    savePass: 'UPDATE user SET password = ? WHERE username = ?',
    // loginType == "resUser"
    resUser: 'INSERT INTO user(username, password, phone, power, email) VALUE(?, ?, ?, ?, ?)',
    // loginType == "resUser" 正式注册前查询用户名是否重复
    checkName: 'SELECT * FROM user WHERE username = ?',
    checkshopName: 'SELECT * FROM shop WHERE shopname = ?',
    checkfoodName: 'SELECT * FROM food WHERE foodname = ? AND foodofshop = ?',
    checkresfoodName: 'SELECT * FROM resfood WHERE foodname = ? AND foodofshop = ?',
    checkresshopName: 'SELECT * FROM resshop WHERE shopname = ?',
    selectDaikuan: 'SELECT * FROM 贷款',
    selectDisdaikuany: 'SELECT DISTINCT 年 FROM 贷款',
    selectDisdaikuanm: 'SELECT DISTINCT 月 FROM 贷款',
    selectShangpinfang: 'SELECT * FROM 商品房',
    fangjiaCount: 'SELECT 日期,round(sum(新建价格同比)/count(*)-100,1) as 新建价格同比,round(sum(新建价格环比)/count(*)-100,2) as 新建价格环比,round(sum(二手价格同比)/count(*)-100,2) as 二手价格同比,round(sum(二手价格环比)/count(*)-100,2) as 二手价格环比 from 房价 where 年=(select max(年) from 房价) group by 日期',
    fangjiaCountd: 'SELECT 日期,round(sum(新建价格同比)/count(*)-100,1) as 新建价格同比,round(sum(新建价格环比)/count(*)-100,2) as 新建价格环比,round(sum(二手价格同比)/count(*)-100,2) as 二手价格同比,round(sum(二手价格环比)/count(*)-100,2) as 二手价格环比 from 房价 where 日期 between ? and ? group by 日期',
    selectDisfangjiacity: 'SELECT distinct 城市 FROM 房价',
    selectfangjiacountc: 'SELECT 日期,城市,round(sum(新建价格同比)/count(*)-100,1) as 新建价格同比,round(sum(新建价格环比)/count(*)-100,2) as 新建价格环比,round(sum(二手价格同比)/count(*)-100,2) as 二手价格同比,round(sum(二手价格环比)/count(*)-100,2) as 二手价格环比 from 房价 where 年=(select max(年) from 房价) and 城市 in ("北京","上海","广州","深圳","杭州") group by 日期,城市',
    checkPhone: 'SELECT * FROM user WHERE phone = ?',
    checkresName: 'SELECT * FROM resuser WHERE username = ?',
    modUsermess: 'UPDATE user SET username = ?, password = ?, phone = ?, email = ? WHERE id = ?',
    selectUsers: 'SELECT * FROM user',
    editUsermess: 'UPDATE user SET phone = ?, email = ? WHERE username = ?',
    deleteUser: 'DELETE FROM user WHERE username = ?',
    insertuser: 'INSERT INTO user(username, password, phone, power, email) VALUE(?, ?, ?, ?, ?)',
    insertresuser: 'INSERT INTO resuser(username, password, phone, power, email) VALUE(?, ?, ?, ?, ?)',
}