const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const feedbackSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    userId:{
        type:String,
        required:true,
        select:true
    },
    type:{
        type: String,
        enum: ['功能建议', '性能建议','其他'],
        required:true,
        select: true
    },
    content:{
        type:String,
        required:true,
        select: true
    },
    contactWay:{
        type:String,
        required:true,
        select: true
    }
}, {
    timestamps: true
});

module.exports = model('Feedback', feedbackSchema);