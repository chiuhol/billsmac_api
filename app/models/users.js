const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const userSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    phone:{
        type:String,
        required: true,
        select: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    wechat_openId:{
        type:String,
        required:false,
        select: true
    },
    qq_openId:{
        type:String,
        required:false,
        select: true
    },
    nikeName: {
        type: String,
        required: false,
        select: true
    },
    avatar_url: {
        type: String,
        required: false,
        select: true
    },
    gender: {
        type: String,
        enum: ['male', 'female','secrecy'],
        default: 'secrecy',
        required: false,
        select: true
    },
    identity: {
        type: String,
        enum: ['student', 'office','other'],
        required:false,
        select: true
    },
    locations: {
        type: String,
        required: false,
        select: true
    },
    birth:{
        type:String,
        required: false,
        select: true
    },
    remindTime:{
        type:String,
        required: false,
        select: true
    }
},{timestamps:true});

module.exports = model('User', userSchema);