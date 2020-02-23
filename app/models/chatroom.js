const mongoose = require('mongoose');

const {
    Schema,
    model
} = mongoose;

const chatroomSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    userId: {
        type:String,
        required:true
    },
    chatName: {
        type: String,
        required: false
    },
    background: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});

module.exports = model('Chatroom', chatroomSchema);