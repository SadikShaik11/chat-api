const Message  = require('../models/message')
const Chat  = require('../models/chat')
const express = require('express')
const router = express.Router()

//completed
router.post('/createChat', (req, res) => {
    Chat.create({
        _id: req.body.appointment,
        members: [ req.body.doctorID, req.body.patientID ]
    }, (err, chat) => {
        if (err) {
            console.log('CREATE CHAT Error: ' + err);
            return res.status(500).send('CREATE CHAT Error');
        } else {
            console.log("Chat created: " + chat)
            return res.status(200).json(chat);
        }
    })
})

///completed ...before creating message checks if user is member of the chat
router.post('/sendMsg', (req, res) => {
    Chat.findById(req.body.appointment, (error, chat) => {
        if (error || chat === null) { 
            console.log('SEND MSG Error: ' + error);
            return res.status(500).send('SEND MSG Error');
        } else if(chat.members.includes(req.body.username)) {
            // CREATE message
            Message.create({
                appointment : req.body.appointment,
                username: req.body.username,
                text: req.body.text,
                attachment: req.body.attachment
            }, (err, message) => {
                if (err) {
                    console.log('SEND MSG Error: ' + err);
                    return res.status(500).send('SEND MSG Error');
                } else {
                    chat.messagesRef.push(message._id)
                    chat.save()
                    console.log("MSG ID pushed to MessageRef");
                    return res.status(200).json(message);
                }
            })
        } else {
            console.log('You are not Authorized to send msgs');
            return res.status(500).send('You are not Authorized to send msgs');
        }
    })
})

//completed ...uses pagination
//used path parameters
router.get('/getChat/:appointment', async (req, res) => {
    const page = parseInt( req.query.page )
    const limit = parseInt( req.query.limit )
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    Chat.findById(req.params.appointment, (error, chat) => {
        if (error || chat === null) { 
            console.log('GET CHAT Error: ' + error);
            return res.status(500).send('GET CHAT Error');
        } else {
            const total_messages = chat.messagesRef.length
            const total_pages = Math.ceil( total_messages / limit )
            const current_page = page
            const paginatedRes = chat.messagesRef.sort().slice(startIndex, endIndex)
            
            Message.find({ 
                '_id': { $in: paginatedRes}
            }, (err, messages) => {
                if(!err) {
                    return res.json({ total_pages, total_messages, current_page, limit, messages })
                } else {
                    console.log('GET CHAT Error: ' + error);
                    return res.status(500).send('GET CHAT Error');
                }
            })
        }
    })
})


// delete message endpoint not required
// it only deletes message not the ref created in Chat.messagesRef
/*
//used path parameters
router.delete('/delMsg/:id', (req, res) => {
    console.log("Message deleted!")
    Message.findById(req.params.id, (err, message) => {
        if (err) { 
            console.log('DELETE Error: ' + err);
            return res.status(500).send('DELETE Error');
        } else if (message) {
            message.remove( () => {
                res.status(200).json(message);
            });
        } else {
            return res.status(404).send('No Message found!')
        }
    })
})
*/
 
module.exports = router