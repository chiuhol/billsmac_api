const Comments = require('../models/comments');
const Acticles = require('../models/communityActicle');
const CommentsAgree = require('../models/commentsAgree');
const CommentsLike = require('../models/commentsLike');
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
        var newComments = [];
        for(var i = 0; i < comments.length; i++){
            var agreeLst = [];
            var likeLst = [];
            const agree = await CommentsAgree.find({
                commentId:comments[i]._id
            });
            const like = await CommentsLike.find({
                commentId:comments[i]._id
            });
            //统计点赞
            if(agree.length != 0){
                for(var j = 0; j < agree.length; j++){
                    agreeLst.push(agree[j].userId);
                }
            }
            //统计喜欢
            if(like.length != 0){
                for(var k = 0; k < like.length; k++){
                    likeLst.push(like[k].userId);
                }
            }
            newComments.push({"comments":comments[i],"agreeLst":agreeLst,"likeLst":likeLst});
        }
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                newComments
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
    //点赞
    async agree(ctx){
        ctx.verifyParams({
            commentId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const agree = await new CommentsAgree(ctx.request.body).save();
        await Comments.findByIdAndUpdate(ctx.query.commentId, {
            $inc: {
                agreeNum: 1
            }
        });
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                agree
            }
        };
    }
    //取消点赞
    async cancelAgree(ctx){
        ctx.verifyParams({
            commentId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const agree = await CommentsAgree.remove(
            {
                commentId:ctx.request.body.commentId,
                userId:ctx.request.body.userId
            }
        );
        //评论点赞数-1
        await Comments.findByIdAndUpdate(ctx.query.commentId, {
            $inc: {
                agreeNum: -1
            }
        });
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                agree
            }
        };
    }
    //喜欢
    async like(ctx){
        ctx.verifyParams({
            commentId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const like = await new CommentsLike(ctx.request.body).save();
        await Comments.findByIdAndUpdate(ctx.query.commentId, {
            $inc: {
                likeNum: 1
            }
        });
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                like
            }
        };
    }
    //取消喜欢
    async cancelLike(ctx){
        ctx.verifyParams({
            commentId: {
                type: 'string',
                required: true
            },
            userId: {
                type: 'string',
                required: true
            }
        });
        const like = await CommentsLike.remove(
            {
                commentId:ctx.request.body.commentId,
                userId:ctx.request.body.userId
            }
        );
        //评论喜欢数-1
        await Comments.findByIdAndUpdate(ctx.query.commentId, {
            $inc: {
                likeNum: -1
            }
        });
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                like
            }
        };
    }
}

module.exports = new CommentsCtl();