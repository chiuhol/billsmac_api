const Acticles = require('../models/communityActicle');
const ArticlesGoodQuestion = require('../models/articleGoodQuestion');
const ArticlesFocus = require('../models/articleFocus');
const ArticleFocus = require('../models/articleFocus');
const ArticleGoodQuestion = require('../models/articleGoodQuestion');
const {
    secretA
} = require('../config');

class ActiclesCtl {
    async find(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
        if(ctx.query.q === 'following'){
            const focus = await ArticlesFocus.find({
                userId:ctx.query.userId
            });
            var newArticleLst = [];
            for(var i = 0; i < focus.length; i++){
                const acticle = await Acticles
                .findOne({
                    status: true,_id:focus[i].communityArticleId
                });
                if(acticle){
                    newArticleLst.push(acticle);
                }
            }
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    newArticleLst
                }
            };
        }else if(ctx.query.q === 'recommend'){
            console.log('recommend');
            const acticle = await Acticles
            .find({
                status: true,recommend: true
            })
            .limit(15).sort({'UnitTen':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
        }else if(ctx.query.q === 'hot'){
            console.log('hot');
            const acticle = await Acticles
            .find(
                {status: true}
            ).limit(perPage).skip(page * perPage).sort({'UnitTen':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
        }else{
            console.log('else');
            const acticle = await Acticles
            .find({
                status: true,title:new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage).sort({'UnitTen':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
        }
    }
    async findAll(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
            const acticle = await Acticles
            .find({
                title:new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage).sort({'UnitTen':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
    }
    async findByActicleId(ctx) {
        const article = await Acticles.findOne({
            status: true,
            _id: ctx.params.id
        });
        if (!article) {
            ctx.throw(404, '该文章不存在');
        } else {
            await Acticles.findByIdAndUpdate(ctx.params.id, {
                $inc: {
                    browseNum: 1,
                    UnitTen: 1
                }
            });
        }
        const articlesFocus = await ArticleFocus.find({
            communityArticleId:ctx.params.id
        });
        const articlesGoodQuestion = await ArticleGoodQuestion.find({
            communityArticleId:ctx.params.id
        });
        var focusLst = [];
        for(var i = 0; i < articlesFocus.length; i++){
            focusLst.push(articlesFocus[i].userId);
        }
        var goodQuestionLst = [];
        for(var j = 0; j < articlesGoodQuestion.length; j++){
            goodQuestionLst.push(articlesGoodQuestion[j].userId);
        }
        var newArticle = {
            "article":article,
            "focusLst":focusLst,
            "goodQuestionLst":goodQuestionLst
        };
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                newArticle
            }
        };
    }
    async create(ctx) {
        ctx.verifyParams({
            title: {
                type: 'string',
                required: true
            },
            subTitle: {
                type: 'string',
                required: false
            },
            content: {
                type: 'string',
                required: true
            },
            thumbnail: {
                type: 'string',
                required: false
            },
            topics: {
                type: 'array',
                required: false
            }
        });
        const acticle = await new Acticles(ctx.request.body).save();
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                acticle
            }
        };
    }
    async update(ctx) {
        ctx.verifyParams({
            title: {
                type: 'string',
                required: false
            },
            subTitle: {
                type: 'string',
                required: false
            },
            content: {
                type: 'string',
                required: false
            },
            thumbnail: {
                type: 'string',
                required: false
            },
            topics: {
                type: 'array',
                required: false
            },
            recommend: {
                type: 'boolean',
                required: false
            },
            following: {
                type: 'boolean',
                required: false
            },
            isGoods: {
                type: 'boolean',
                required: false
            },
            status: {
                type: 'boolean',
                required: false
            },
        });
        //实现对关注数的自增或自减
        if (typeof (ctx.request.body.following) !== "undefined") {
            console.log("关注数" + ctx.request.body.following);
            if (ctx.request.body.following === true) {
                await Acticles.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        focusNum: 1
                    }
                });
            } else {
                await Acticles.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        focusNum: -1
                    }
                });
            }
        }
        console.log(ctx.request.body);
        const acticles = await Acticles.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!acticles) {
            ctx.throw(404, '该文章不存在');
        }
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                acticles
            }
        };
    }
    //好问题
    async goodQuestion(ctx){
        ctx.verifyParams({
            communityArticleId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const goodQuQesion = await ArticlesGoodQuestion(ctx.request.body).save();
        //文章好问题数+1
        await Acticles.findByIdAndUpdate(ctx.query.communityArticleId, {
            $inc: {
                goodsNum: 1
            }
        });
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                goodQuQesion
            }
        };
    }
    //取消好问题
    async cancelGoodQuestion(ctx){
        ctx.verifyParams({
            communityArticleId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const goodQuQesion = await ArticlesGoodQuestion.remove(
            {
                communityArticleId:ctx.request.body.communityArticleId,
                userId:ctx.request.body.userId
            }
        );
        //文章好问题数-1
        await Acticles.findByIdAndUpdate(ctx.query.communityArticleId, {
            $inc: {
                goodsNum: -1
            }
        });
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                goodQuQesion
            }
        };
    }
    //关注
    async focus(ctx){
        ctx.verifyParams({
            communityArticleId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const focus = await ArticlesFocus(ctx.request.body).save();
        //文章关注数+1
        await Acticles.findByIdAndUpdate(ctx.query.communityArticleId, {
            $inc: {
                focusNum: 1
            }
        });
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                focus
            }
        };
    }
    //取消关注
    async cancelFocus(ctx){
        ctx.verifyParams({
            communityArticleId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const focus = await ArticlesFocus.remove(
            {
                communityArticleId:ctx.request.body.communityArticleId,
                userId:ctx.request.body.userId
            }
        );
        //文章关注数-1
        await Acticles.findByIdAndUpdate(ctx.query.communityArticleId, {
            $inc: {
                focusNum: -1
            }
        });
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                focus
            }
        };
    }
}

module.exports = new ActiclesCtl();