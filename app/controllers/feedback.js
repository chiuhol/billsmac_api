const Feedback = require('../models/feedback');
const {
    secret
} = require('../config');

class FeedBackCtl {
    async find(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
        ctx.body = await Feedback
            .find({
                type: new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage);
    }
    async findByUserId(ctx) {
        const feedback = await Feedback.find({
            userId: ctx.params.id
        });
        if (!feedback) {
            ctx.throw(404, '该用户暂无反馈历史');
        }
        ctx.body = feedback;
    }
    async create(ctx) {
        ctx.verifyParams({
            userId: {
                type: 'string',
                required: true
            },
            type: {
                type: 'string',
                required: true
            },
            content: {
                type: 'string',
                required: true
            },
            contactWay: {
                type: 'string',
                required: true
            }
        });
        const feedback = await new Feedback(ctx.request.body).save();
        ctx.body = feedback;
    }
}

module.exports = new FeedBackCtl();