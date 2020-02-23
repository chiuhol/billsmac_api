const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/chatroom'
});
const {
    findByUserId,
    checkOwner,
    find,
    update
} = require('../controllers/chatroom');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/',find);

router.get('/:id', auth,checkOwner,findByUserId);

router.patch('/:id',auth,update);

module.exports = router;