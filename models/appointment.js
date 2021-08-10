const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const appointmentSchema = new Schema({
    members: { 
        type: String, 
        required: true 
    },
    appointmentID: { 
        type: String,
        required: true 
    },
})

const Message = mongoose.model("Message", messageSchema)

module.exports = Message;