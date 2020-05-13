const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/chatroom/:chatroomId/chatContent'
});
const {
    find,create,update,static,staticByType
} = require('../controllers/chatContent');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.post('/',create);

router.patch('/:id', update);

router.get('/static',static);

router.get('/staticByType',staticByType);

module.exports = router;