const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const commentsSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    //关联的文章ID
    communityActicleId:{
        type:String,
        required:true,
        select:true
    },
    //用户ID
    userId:{
        type:String,
        required:false,
        select:true
    },
    //用户名称
    userName:{
        type:String,
        required:false,
        select:true
    },
    //用户头像
    userAvatar:{
        type:String,
        required:false,
        select:true
    },
    //内容
    content:{
        type:String,
        required:false,
        select:true
    },
    //评论数
    commentNum:{
        type:Number,
        required:false,
        select:true
    },
    //赞同数
    agreeNum:{
        type:Number,
        required:false,
        select:true
    },
    //喜欢数
    likeNum:{
        type:Number,
        required:false,
        select:true
    },
    //是否赞同
    isAgree:{
        type:Boolean,
        default:false,
        required:false,
        select:true
    },
    //是否喜欢
    isLike:{
        type:Boolean,
        default:false,
        required:false,
        select:true
    },
    //是否启用
    status:{
        type:Boolean,
        default:true,
        required:false,
        select:true
    }
}, {
    timestamps: true
});

module.exports = model('Comments', commentsSchema);