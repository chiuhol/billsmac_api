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
        if(ctx.query.q === 'following'){
            console.log('following');
            const acticle = await Acticles
            .find({
                status: true,following: true
            })
            .limit(perPage).skip(page * perPage).sort({'createdAt':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
        }else if(ctx.query.q === 'recommend'){
            console.log('recommend');
            const acticle = await Acticles
            .find({
                status: true,recommend: true
            })
            .limit(15).sort({'UnitTen':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
        }else if(ctx.query.q === 'hot'){
            console.log('hot');
            const acticle = await Acticles
            .find(
                {status: true}
            ).limit(perPage).skip(page * perPage).sort({'UnitTen':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
        }else{
            console.log('else');
            const acticle = await Acticles
            .find({
                status: true,title:new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage).sort({'UnitTen':-1});
            ctx.body = {
                status:200,
                msg:'success',
                data:{
                    acticle
                }
            };
        }
    }
    async findByActicleId(ctx) {
        const acticle = await Acticles.find({
            status: true,
            _id: ctx.params.id
        });
        if (!acticle) {
            ctx.throw(404, '该文章不存在');
        } else {
            await Acticles.findByIdAndUpdate(ctx.params.id, {
                $inc: {
                    browseNum: 1,
                    UnitTen: 1
                }
            });
        }
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                acticle
            }
        };
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
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                acticle
            }
        };
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
            isGoods: {
                type: 'boolean',
                required: false
            },
            status: {
                type: 'boolean',
                required: false
            },
        });
        //实现对好问题数的自增或自减
        if (typeof (ctx.request.body.isGoods) !== "undefined") {
            console.log("好问题数" + ctx.request.body.isGoods);
            if (ctx.request.body.isGoods === true) {
                await Acticles.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        goodsNum: 1
                    }
                });
            } else {
                await Acticles.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        goodsNum: -1
                    }
                });
            }
        }
        //实现对关注数的自增或自减
        if (typeof (ctx.request.body.following) !== "undefined") {
            console.log("关注数" + ctx.request.body.following);
            if (ctx.request.body.following === true) {
                await Acticles.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        focusNum: 1
                    }
                });
            } else {
                await Acticles.findByIdAndUpdate(ctx.params.id, {
                    $inc: {
                        focusNum: -1
                    }
                });
            }
        }
        console.log(ctx.request.body);
        const acticles = await Acticles.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!acticles) {
            ctx.throw(404, '该文章不存在');
        }
        ctx.body = {
            status:200,
            msg:'success',
            data:{
                acticle
            }
        };
    }
}

module.exports = new ActiclesCtl();