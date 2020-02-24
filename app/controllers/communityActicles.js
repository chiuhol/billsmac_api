const Acticles = require('../models/communityActicle');
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
            .find({status: true})
            .limit(perPage).skip(page * perPage);
    }
    async findByActicleId(ctx) {
        const acticle = await Acticles.findById(ctx.params.id);
        if (!acticle) {
            ctx.throw(404, '该文章不存在');
        }
        ctx.body = acticle;
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
        ctx.body = acticle;
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
            status: {
                type: 'boolean',
                required: false
            },
        });
        const acticles = await Acticles.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!acticles) {
            ctx.throw(404, '该文章不存在');
        }
        ctx.body = acticles;
    }
}

module.exports = new ActiclesCtl();