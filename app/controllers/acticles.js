const Acticles = require('../models/acticles');
const {
    secret
} = require('../config');

class ActiclesCtl {
    async find(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
        ctx.body = await Acticles
            .find({
                type: new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage);
    }
    async create(ctx) {
        ctx.verifyParams({
            type: {
                type: 'string',
                required: true
            },
            content: {
                type: 'string',
                required: true
            }
        });
        const acticle = await new Acticles(ctx.request.body).save();
        ctx.body = acticle;
    }
}

module.exports = new ActiclesCtl();