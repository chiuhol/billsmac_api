const Comments = require('../models/comments');
const Acticles = require('../models/communityActicle');
const {
    secret
} = require('../config');

class CommentsCtl {
    async findByActicleId(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
        const comments = await Comments.find({
            communityActicleId: ctx.params.communityActiclesId,
            status: true
        }).limit(perPage).skip(page * perPage);
        if (!comments) {
            ctx.throw(404, '该文章暂无评论');
        }
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                comments
            }
        };
    }
    async create(ctx) {
        ctx.verifyParams({
            communityActicleId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: false
            },
            userName: {
                type: 'string',
                required: false
            },
            userAvatar: {
                type: 'string',
                required: false
            },
            content: {
                type: 'string',
                required: true
            }
        });
        console.log(1111);
        const comments = await new Comments(ctx.request.body).save();
        await Acticles.findByIdAndUpdate(ctx.request.body.communityActicleId, {
            $inc: {
                commentNum: 1
            }
        });
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                comments
            }
        };
    }
    async update(ctx) {
        ctx.verifyParams({
            commentNum: {
                type: 'string',
                required: false
            },
            agreeNum: {
                type: 'string',
                required: false
            },
            likeNum: {
                type: 'string',
                required: false
            },
            isAgree: {
                type: 'boolean',
                required: false
            },
            isLike: {
                type: 'boolean',
                required: false
            },
            status: {
                type: 'boolean',
                required: false
            }
        });
        //实现对点赞数的自增或自减
        if (typeof (ctx.request.body.isAgree) !== "undefined") {
            console.log("好问题数" + ctx.request.body.isAgree);
            if (ctx.request.body.isAgree === true) {
                await Comments.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        agreeNum: 1
                    }
                });
            } else {
                await Comments.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        agreeNum: -1
                    }
                });
            }
        }
        //实现对喜欢数的自增或自减
        if (typeof (ctx.request.body.isLike) !== "undefined") {
            console.log("关注数" + ctx.request.body.isLike);
            if (ctx.request.body.isLike === true) {
                await Comments.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        likeNum: 1
                    }
                });
            } else {
                await Comments.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        likeNum: -1
                    }
                });
            }
        }

        const comments = await Comments.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!comments) {
            ctx.throw(404, '该评论不存在');
        }
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                comments
            }
        };
    }
}

module.exports = new CommentsCtl();