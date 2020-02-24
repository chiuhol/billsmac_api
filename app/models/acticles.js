const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const acticlesSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    type:{
        type: String,
        required:true,
        select: true
    },
    content:{
        type:String,
        required:true,
        select: true
    }
}, {
    timestamps: true
});

module.exports = model('Acticle', acticlesSchema);