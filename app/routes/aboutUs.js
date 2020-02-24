const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/aboutUs'
});
const {
    find,update
} = require('../controllers/aboutUs');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.patch('/',update);

module.exports = router;