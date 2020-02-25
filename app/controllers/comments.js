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
            code:200,
            msg:'success',
            data:{
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
        await Acticles.findByIdAndUpdate(ctx.request.body.communityActicleId,{$inc: { commentNum: 1}});
        ctx.body = ctx.body = {
            code:200,
            msg:'success',
            data:{
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
        const comments = await Comments.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!comments) {
            ctx.throw(404, '该评论不存在');
        }
        ctx.body = ctx.body = {
            code:200,
            msg:'success',
            data:{
                comments
            }
        };
    }
}

module.exports = new CommentsCtl();