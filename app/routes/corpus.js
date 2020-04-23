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

const auth = jwt({
    secret
});

router.get('/',find);

router.post('/',create);

router.patch('/:id',auth,update);

module.exports = router;