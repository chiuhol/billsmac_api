const ChatContent = require('../models/chatContent');
const {
    secret
} = require('../config');

class ChatContentCtl {
    async find(ctx){
        const {per_page=10} = ctx.query;
        const page = Math.max(ctx.query.page*1,1)-1;
        const perPage = Math.max(per_page*1,1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await ChatContent
        .find({$or: [
            { key1: {$regex: q} },
            { key2: {$regex: q} },
            { key3: {$regex: q} }
        ],status:true,chatroomId:ctx.params.chatroomId})
        .limit(perPage).skip(page*perPage).sort({updatedAt:-1});
    }
    async create(ctx) {
        ctx.verifyParams({
            rightcontent: {
                type: 'array',
                required: true
            }
        });
        const user = ctx.state.user._id;
        const {chatroomId} = ctx.params;
        const chatContent = await new ChatContent({...ctx.request.body,user,chatroomId}).save();
        ctx.body = chatContent;
    }
    async update(ctx){
        ctx.verifyParams({
            rightcontent: {
                type: 'array',
                required: false
            }
        });
        const chatContent = await ChatContent.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = chatContent;
    }
}

module.exports = new ChatContentCtl();