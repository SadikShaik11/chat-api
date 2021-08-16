const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const chatSchema = new Schema({
    _id: { 
        type: String
    },
    members: [{ 
        type: String
    }],
    messagesRef: [{
        type: Schema.Types.ObjectId, 
        ref:'Message'
    }]
}, { versionKey: false, timestamps: true, collection: 'chats', _id: false })

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat;