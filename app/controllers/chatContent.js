const ChatContent = require('../models/chatContent');
const {
    secret
} = require('../config');

class ChatContentCtl {
    async find(ctx) {
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const chatContent = await ChatContent
            .find({
                status: true,
                chatroomId: ctx.params.chatroomId,
                'rightcontent.typeStr': q
            })
            .limit(perPage).skip(page * perPage).sort({
                updatedAt: -1
            });
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                chatContent
            }
        };
    }
    async create(ctx) {
        ctx.verifyParams({
            rightcontent: {
                type: 'object',
                required: true
            }
        });
        const user = ctx.state.user._id;
        const {
            chatroomId
        } = ctx.params;
        const chatContent = await new ChatContent({
            ...ctx.request.body,
            user,
            chatroomId
        }).save();
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                chatContent
            }
        };
    }
    async update(ctx) {
        ctx.verifyParams({
            rightcontent: {
                type: 'object',
                required: false
            }
        });
        const chatContent = await ChatContent.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                chatContent
            }
        };
    }
}

module.exports = new ChatContentCtl();