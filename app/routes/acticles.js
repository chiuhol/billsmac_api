const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/acticles'
});
const {
    find,create
} = require('../controllers/acticles');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.post('/',create);

module.exports = router;