const Objects = require('../models/objects');
const {
    secret
} = require('../config');

class ObjectsCtl {
    async findByObjectId(ctx) {
        const objects = await Objects.find({
            status: true,
            userId: ctx.params.id
        });
        if (!objects) {
            ctx.throw(404, '该用户暂无对象');
        }
        ctx.body = {
            code:200,
            msg:'success',
            data:{objects}
        };
    }
    async create(ctx) {
        ctx.verifyParams({
            userId: {
                type: 'string',
                required: true
            },
            avatar: {
                type: 'string',
                required: false
            },
            nikeName: {
                type: 'string',
                required: false
            },
            calledMe: {
                type: 'string',
                required: false
            }
        });
        const { nikeName } = ctx.request.body;
        const repeatedObjects = await Objects.findOne({ nikeName });
        console.log(repeatedObjects);
        if (repeatedObjects) {
            ctx.throw(409, '该对象已存在');
        }
        const objects = await new Objects(ctx.request.body).save();
        ctx.body = {
            code:200,
            msg:'success',
            data:{objects}
        };
    }
    async update(ctx) {
        console.log(ctx.params.id);
        console.log(ctx.request.body);
        ctx.verifyParams({
            avatar: {
                type: 'string',
                required: false
            },
            nikeName: {
                type: 'string',
                required: false
            },
            calledMe: {
                type: 'string',
                required: false
            },
            status: {
                type: 'boolean',
                required: false
            }
        });
        const objects = await Objects.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!objects) {
            ctx.throw(404, '该对象不存在');
        }
        ctx.body = {
            code:200,
            msg:'success',
            data:{objects}
        };
    }
}

module.exports = new ObjectsCtl();