const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/chatroom/:chatroomId/chatContent'
});
const {
    find,create,update
} = require('../controllers/chatContent');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.post('/', auth,create);

router.patch('/:id', auth, update);

module.exports = router;