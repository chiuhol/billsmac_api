const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const commentsLikeSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    //关联的评论ID
    commentId:{
        type:String,
        required:true,
        select:true
    },
    //用户ID
    userId:{
        type:String,
        required:true,
        select:true
    }
}, {
    timestamps: true
});

module.exports = model('CommentsLike', commentsLikeSchema);