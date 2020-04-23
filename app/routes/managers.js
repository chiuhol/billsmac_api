const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/managers'
});
const {
    find,
    findById,
    create,
    update,
    login,
} = require('../controllers/managers');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

router.patch('/:id', update);

router.post('/login', login);

module.exports = router;