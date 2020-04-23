const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const managersSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    jobNum:{
        type:String,
        required:true,
        select:true
    },
    account:{
        type:String,
        required: true,
        select: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    status:{
        type:Boolean,
        required:false,
        default:true,
        select:true
    }
},{timestamps:true});

module.exports = model('Managers', managersSchema);