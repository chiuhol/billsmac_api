const Corpus = require('../models/corpus');
const {
    secret
} = require('../config');

class CorpusCtl {
    async find(ctx) {
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        if(ctx.query.q==""){
            const corpus = await Corpus
            .find()
            .limit(perPage).skip(page * perPage).sort({
                updatedAt: -1
            });
            ctx.body = {
                status: 200,
                msg: 'success',
                data: {
                    corpus
                }
            };
        }
        else if(ctx.query.q=="user"){
            const corpus = await Corpus
            .find({
                status: true,
                userId: ctx.params.userId
            })
            .limit(perPage).skip(page * perPage).sort({
                updatedAt: -1
            });
            ctx.body = {
                status: 200,
                msg: 'success',
                data: {
                    corpus
                }
            };
        }else{
            const corpus = await Corpus
            .find({
                status: true,
                userId: ctx.params.userId,
                content: q
            });
            ctx.body = {
                status: 200,
                msg: 'success',
                data: {
                    corpus:corpus[Math.floor(Math.random()*corpus.length)]
                }
            };
        }
    }
    async create(ctx) {
        ctx.verifyParams({
            userId: {
                type: 'string',
                required: false
            },
            content: {
                type: 'string',
                required: true
            },
            response: {
                type: 'string',
                required: true
            }
        });
        const corpus = await new Corpus(ctx.request.body).save();
        ctx.body = {
            status:200,
            msg:'success',
            data:{corpus}
        };
    }
    async update(ctx) {
        ctx.verifyParams({
            content: {
                type: 'string',
                required: false
            },
            response: {
                type: 'string',
                required: false
            },
            status:{
                type:'boolean',
                required:false
            }
        });
        const corpus = await Corpus.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!corpus) {
            ctx.throw(404, '该语料不存在');
        }
        ctx.body = ctx.body = {
            status:200,
            msg:'success',
            data:{
                corpus
            }
        };
    }
}

module.exports = new CorpusCtl();