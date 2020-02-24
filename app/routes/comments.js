const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/communityActicles/:communityActiclesId/comments'
});
const {
    findByActicleId,create,update
} = require('../controllers/comments');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', findByActicleId);

router.post('/',auth,create);

router.patch('/:id',auth,update);

module.exports = router;