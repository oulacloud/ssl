const express = require('express');
const router = express.Router();
const api = require('./api');

// 登录页接口
router.get('/loginPage', (req, res, next) => {
    api.loginPage(req, res, next);
});
// 个人中心修改个人信息
router.get('/modusermess', (req, res, next) => {
    api.modusermess(req, res, next);
});
// 用户列表查询所有用户
router.get('/userlist', (req, res, next) => {
    api.userlist(req, res, next);
});
// 用户列表编辑用户
router.get('/editusermess', (req, res, next) => {
    api.editusermess(req, res, next);
});
// 用户列表删除用户
router.get('/deleteuser', (req, res, next) => {
    api.deleteuser(req, res, next);
});
// 根据用户名重新查询更新sessionstorage
router.get('/searchusername', (req, res, next) => {
    api.searchusername(req, res, next);
});
// 根据用户名重新查询更新sessionstorage
router.get('/adduser', (req, res, next) => {
    api.adduser(req, res, next);
});
// 注册用户列表
router.get('/resuser', (req, res, next) => {
    api.resuser(req, res, next);
});
// 查询注册用户列表
router.get('/reslist', (req, res, next) => {
    api.reslist(req, res, next);
});
router.get('/deleteresuser', (req, res, next) => {
    api.deleteresuser(req, res, next);
});
router.get('/daikuanlist', (req, res, next) => {
    api.daikuanlist(req, res, next);
});
router.get('/shangpinfanglist', (req, res, next) => {
    api.shangpinfanglist(req, res, next);
});
router.get('/getusershopname', (req, res, next) => {
    api.getusershopname(req, res, next);
});
router.get('/getuserfoodlist', (req, res, next) => {
    api.getuserfoodlist(req, res, next);
});
// 贷款分析
router.get('/daikuanym', (req, res, next) => {
    api.daikuanym(req, res, next);
});
router.get('/fangjiacount', (req, res, next) => {
    api.fangjiacount(req, res, next);
});
router.get('/fangjiacountd', (req, res, next) => {
    api.fangjiacountd(req, res, next);
});
router.get('/fangjiacountcd', (req, res, next) => {
    api.fangjiacountcd(req, res, next);
});
module.exports = router;