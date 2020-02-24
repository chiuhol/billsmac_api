const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const aboutUsSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    qqGroup:{
        type: String,
        required:false,
        select: true
    },
    officialAccount:{
        type: String,
        required:false,
        select: true
    },
    emailAddress:{
        type: String,
        required:false,
        select: true
    },
    phoneNum:{
        type:String,
        required:false,
        select: true
    }
}, {
    timestamps: true
});

module.exports = model('AboutUs', aboutUsSchema);