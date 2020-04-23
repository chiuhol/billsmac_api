const jsonwebtoken = require('jsonwebtoken');
const Managers = require('../models/managers');
const {
    secret
} = require('../config');

class ManagersCtl {
    async find(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
        const managers = await Managers
            .find({
                jobNum: new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage);
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                managers
            }
        };
    }
    async findById(ctx) {
        const {
            fields = ''
        } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const manager = await Managers.findById(ctx.params.id).select(selectFields);
        if (!manager) {
            ctx.throw(404, '该管理员不存在');
        }
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                manager
            }
        };
    }
    async create(ctx) {
        ctx.verifyParams({
            jobNum: {
                type: 'string',
                required: true
            },
            account: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        });
        const {
            account
        } = ctx.request.body;
        const repeatedManager = await Managers.findOne({
            account
        });
        if (repeatedManager) {
            ctx.throw(409, '该管理员已存在');
        }
        const manager = await new Managers(ctx.request.body).save();
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                manager
            }
        };
    }
    async update(ctx) {
        ctx.verifyParams({
            jobNum: {
                type: 'string',
                required: false
            },
            account: {
                type: 'string',
                required: false
            },
            password: {
                type: 'string',
                required: false
            },
            status:{
                type:'boolean',
                required:false
            }

        });
        if(ctx.request.body.account != null && ctx.request.body.account != ''){
            const repeatedManager = await Managers.findOne({
                account
            });
            if (repeatedManager) {
                ctx.throw(409, '该管理员账号已存在');
            }
        }
        const manager = await Managers.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!manager) {
            ctx.throw(404, '该管理员不存在');
        }
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                manager
            }
        };
    }
    async login(ctx) {
        const manager = await Managers.findOne(ctx.request.body);
        if (!manager) {
            ctx.throw(401, '用户名或密码不正确');
        }
        console.log(manager);
        const {
            _id,
            account
        } = manager;
        const token = jsonwebtoken.sign({
            _id,
            account
        }, secret, {
            expiresIn: '1d'
        });
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                token,
                manager
            }
        };
    }
}

module.exports = new ManagersCtl();