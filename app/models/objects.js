const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const objectsSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    userId:{
        type:String,
        required:true,
        select:true
    },
    avatar:{
        type:String,
        required:false,
        select:true
    },
    nikeName:{
        type:String,
        required:false,
        select:true
    },
    calledMe:{
        type:String,
        required:false,
        select:true
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

module.exports = model('Objects', objectsSchema);