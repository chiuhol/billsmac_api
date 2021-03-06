const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const Chatroom = require('../models/chatroom');
const Objects = require('../models/objects');
const {
    secret
} = require('../config');

class UsersCtl {
    async find(ctx) {
        const {
            per_Page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_Page * 1, 1);
        const user = await User
            .find({
                phone: new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage);
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                user
            }
        };
    }
    async findById(ctx) {
        const {
            fields = ''
        } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const user = await User.findById(ctx.params.id).select(selectFields);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        const objects = await Objects.find({
            status: true,
            userId: ctx.params.id
        });
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                user,
                objects
            }
        };
    }
    async create(ctx) {
        console.log(ctx.request.body);
        ctx.verifyParams({
            phone: {
                type: 'string',
                required: false
            },
            password: {
                type: 'string',
                required: false
            },
            wechat_openId: {
                type: 'string',
                required: false
            },
            qq_openId: {
                type: 'string',
                required: false
            }
        });
        const {
            phone
        } = ctx.request.body;
        const repeatedUser = await User.findOne({
            phone
        });
        console.log(repeatedUser);
        if (repeatedUser) {
            ctx.throw(409, '用户已存在');
        }
        const user = await new User(ctx.request.body).save();
        const chatroom = await new Chatroom({
            userId: user.id
        }).save();
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                user,
                chatroom
            }
        };
    }
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    async update(ctx) {
        console.log(ctx.request.body);
        ctx.verifyParams({
            phone: {
                type: 'string',
                required: false
            },
            password: {
                type: 'string',
                required: false
            },
            wechat_openId: {
                type: 'string',
                required: false
            },
            qq_openId: {
                type: 'string',
                required: false
            },
            nikeName: {
                type: 'string',
                required: false
            },
            avatar_url: {
                type: 'string',
                required: false
            },
            gender: {
                type: 'string',
                required: false
            },
            identity: {
                type: 'string',
                required: false
            },
            locations: {
                type: 'string',
                required: false
            },
            birth: {
                type: 'string',
                required: false
            },
            remindTime: {
                type: 'string',
                required: false
            }
        });
        if(ctx.request.body.phone != null && ctx.request.body.phone != ''){
            const repeatedUser = await User.findOne({
                phone
            });
            if (repeatedUser) {
                ctx.throw(409, '该手机号码已存在');
            }
        }
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                user
            }
        };
    }
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.status = 204;
        ctx.body = {
            status: 204,
            msg: 'success'
        };
    }
    async login(ctx) {
        ctx.verifyParams({
            phone: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            },
        });
        const user = await User.findOne(ctx.request.body);
        if (!user) {
            ctx.throw(401, '用户名或密码不正确');
        }
        const {
            _id,
            phone
        } = user;
        const token = jsonwebtoken.sign({
            _id,
            phone
        }, secret, {
            expiresIn: '1d'
        });
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                token,
                user
            }
        };
    }
    async updatePwd(ctx) {
        ctx.verifyParams({
            phone: {
                type: 'string',
                required: true
            },
            oldPwd: {
                type: 'string',
                required: true
            },
            newPwd: {
                type: 'string',
                required: false
            }
        });
        const user1 = await User.findOne({
            "phone": ctx.request.body.phone,
            "password": ctx.request.body.oldPwd
        });
        if (!user1) {
            ctx.throw(401, '密码不正确');
        }
        if(ctx.request.body.newPwd != null && ctx.request.body.newPwd != ''){
            const user2 = await User.findByIdAndUpdate(ctx.params.id, {
                "password": ctx.request.body.newPwd
            });
            if (!user2) {
                ctx.throw(404, '用户不存在');
            }
            ctx.body = {
                status: 200,
                msg: 'success',
                data: {
                    user2
                }
            };
        }else{
            ctx.body = {
                status: 200,
                msg: 'success',
                data: {
                    user1
                }
            };
        }
        
    }
    async userStatic(ctx){
        console.log(1111111);
        const user = await User
        .find({
            phone: new RegExp(ctx.query.q)
        });
        ctx.body = {
            status: 200,
            msg: 'success',
            data: {
                user
            }
        };
    }
}

module.exports = new UsersCtl();