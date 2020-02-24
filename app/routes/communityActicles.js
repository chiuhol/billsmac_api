const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/communityActicles'
});
const {
    find,findByActicleId,create,update
} = require('../controllers/communityActicles');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.get('/:id', findByActicleId);

router.post('/',create);

router.patch('/:id',update);

module.exports = router;