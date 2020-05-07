const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/users/:userId/corpus'
});
const {
    find,update,create
} = require('../controllers/corpus');

const {
    secret
} = require('../config');

router.get('/',find);

router.post('/',create);

router.patch('/:id',update);

module.exports = router;