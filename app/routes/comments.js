const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/communityActicles/:communityActiclesId/comments'
});
const {
    findByActicleId,create,update,agree,cancelAgree,like,cancelLike
} = require('../controllers/comments');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', findByActicleId);

router.post('/',create);

router.patch('/:id',update);

router.post('/agreeComment',agree);

router.post('/cancelAgreeComment',cancelAgree);

router.post('/likeComment',like);

router.post('/cancelLikeComment',cancelLike);

module.exports = router;