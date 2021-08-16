const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
    appointment: { 
        type: String,
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    text: { 
        type: String,
        required: true 
    },
    attachment: { 
        type: String, 
        default: null 
    }
}, { versionKey: false, timestamps: true, collection: 'messages' })

const Message = mongoose.model("Message", messageSchema)

module.exports = Message;