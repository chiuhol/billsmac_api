const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/feedback'
});
const {
    find,findByUserId,create,update
} = require('../controllers/feedback');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.get('/:id', findByUserId);

router.post('/:id', auth,create);

router.patch('/:id',update);

module.exports = router;