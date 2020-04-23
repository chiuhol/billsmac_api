const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const corpusSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    userId: {
        type:String,
        required:false
    },
    content:{
        type:String,
        required:true
    },
    response:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:false,
        default:true
    }
}, {
    timestamps: true
});

module.exports = model('Corpus', corpusSchema);