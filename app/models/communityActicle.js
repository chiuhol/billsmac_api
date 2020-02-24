const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const communityActicleSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    //标题
    title:{
        type:String,
        required:false,
        select:true
    },
    //副标题
    subTitle:{
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
    //热度
    UnitTen:{
        type:Number,
        required:false,
        select:true
    },
    //缩略图
    thumbnail:{
        type:String,
        required:false,
        select:true
    },
    //好问题数
    goodsNum:{
        type:Number,
        required:false,
        select:true
    },
    //关注数
    focusNum:{
        type:Number,
        required:false,
        select:true
    },
    //评论数
    commentNum:{
        type:Number,
        required:false,
        select:true
    },
    //浏览数
    browseNum:{
        type:Number,
        required:false,
        select:true
    },
    //绑定话题
    topics:{
        type:[{
            topicId:{
                type:String,
                required:false,
                select:true
            },
            name:{
                type:String,
                required:false,
                select:true
            }
        }],
        required:false,
        select:true
    },
    //是否关注
    following:{
        type:Boolean,
        default:false,
        required:false,
        select:true
    },
    //是否推荐
    recommend:{
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

module.exports = model('CommunityActicle', communityActicleSchema);