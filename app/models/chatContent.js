const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const chatContentSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    chatroomId:{
        type:String,
        required:true
    },
    leftUserId:{
        type:String,
        required:false
    },
    leftAvatar:{
        type:String,
        required:false
    },
    leftcontent: {
        type: String,
        required: false
    },
    rightcontent: {
        type: {
            typeStr: {
                type: String,
                required: false
            },
            amountType: {
                type: String,
                enum: ['income', 'expend'],
                required: false
            },
            amount: {
                type: String,
                required: false
            }, 
            remark:{
                type:String,
                required:false
            }
        },
        required: false
    },
    rightAvatar:{
        type:String,
        required:false
    },
    status:{
        type:Boolean,
        select:true,
        required:false,
        default: true,
    }
}, {
    timestamps: true
});

module.exports = model('ChatContent', chatContentSchema);