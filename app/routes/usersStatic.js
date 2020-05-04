const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/usersStatic'
});
const {
    userStatic
} = require('../controllers/usersStatic');

const {
    secret
} = require('../config');

router.get('/', userStatic);

module.exports = router;