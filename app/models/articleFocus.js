const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const articleFocusSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    //关联的社区文章ID
    communityArticleId:{
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

module.exports = model('ArticleFocus', articleFocusSchema);