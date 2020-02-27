const Chatroom = require('../models/chatroom');
const {
    secret
} = require('../config');

class ChatroomCtl {
    async find(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
        const chatroom = await Chatroom
            .find()
            .limit(perPage).skip(page * perPage);
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    chatroom
                }
            };
    }
    async findByUserId(ctx) {
        const chatroom = await Chatroom.findOne({userId :ctx.params.id});
        if (!chatroom) {
            ctx.throw(404, '该聊天不存在');
        }
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                chatroom
            }
        };
    }
    async update(ctx) {
        ctx.verifyParams({
            chatName: {
                type: 'string',
                required: false
            },
            background: {
                type: 'string',
                required: false
            }
        });
        const chatroom = await Chatroom.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!chatroom) {
            ctx.throw(404, '聊天室不存在');
        }
        ctx.body = ctx.body = {
            status:200,
            msg:'success',
            data:{
                chatroom
            }
        };
    }
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
}

module.exports = new ChatroomCtl();