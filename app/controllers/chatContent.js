const ChatContent = require('../models/chatContent');
const Corpus = require('../models/corpus');
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
        const typeStr = ctx.request.body.rightcontent.typeStr;
        let corpus = await Corpus.find({
            status: true,
            userId: ctx.state.user._id,
            content: typeStr
        });
        let leftContent;
        if(corpus.length == 0){
            corpus = await Corpus.find({
                status: true,
                content: typeStr
            });
        }
        //如果语料包中都不存在，则为默认
        if(corpus.length == 0){
            leftContent = "好好学习，天天向上！";
        }else{
            leftContent = corpus[Math.floor(Math.random()*corpus.length)].response;//从语料包中随机抽出一个
        }
        const chatContent = await new ChatContent({
            rightcontent:ctx.request.body.rightcontent,
            leftcontent:leftContent,
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