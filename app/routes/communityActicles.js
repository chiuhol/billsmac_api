const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
    prefix: '/communityActicles'
});
const {
    find,findByActicleId,create,update,findAll,goodQuestion,cancelGoodQuestion,focus,cancelFocus
} = require('../controllers/communityActicles');

const {
    secret
} = require('../config');

const auth = jwt({
    secret
});

router.get('/', find);

router.get('/manager', findAll);

router.get('/:id', findByActicleId);

router.post('/',create);

router.patch('/:id',update);

router.post('/good',goodQuestion);

router.post('/cancelGood',cancelGoodQuestion);

router.post('/focusArticle',focus);

router.post('/cancelFocusArticle',cancelFocus);

module.exports = router;