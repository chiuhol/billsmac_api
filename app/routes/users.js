const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/users'
});
const {
    find,
    findById,
    create,
    update,
    delete: del,
    login,
    checkOwner,
    updatePwd,
    userStatic
} = require('../controllers/users');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

router.patch('/:id', auth, checkOwner, update);

router.patch('/updatePwd/:id', auth, checkOwner, updatePwd);

router.delete('/:id', del);

router.post('/login', login);

router.get('/userStatic', userStatic);

module.exports = router;