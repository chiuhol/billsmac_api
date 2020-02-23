const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/users/:userId/objects'
});
const {
    findByObjectId,create,update
} = require('../controllers/objects');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/:id', findByObjectId);

router.post('/', auth,create);

router.patch('/:id', auth, update);

module.exports = router;