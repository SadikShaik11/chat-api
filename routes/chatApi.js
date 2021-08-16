const Message  = require('../models/message')
const Chat  = require('../models/chat')
const express = require('express')
const router = express.Router()

router.post('/createChat', (req, res) => {
    Chat.create({
        _id: req.body.appointment,
        members: [ req.body.doctorID, req.body.patientID ]
    }, (err, chat) => {
        if (err) {
            console.log('CREATE CHAT Error: ' + err);
            return res.status(500).send('CREATE CHAT Error');
        } else {
            //creating pusher private channel
            process.env.CHANNEL = "private-" + chat._id
            console.log("Channel created: " + process.env.CHANNEL)
            return res.status(200).json(process.env.CHANNEL);
        }
    })
})

router.post('/sendMsg', (req, res) => {
    Message.create({
        appointment: req.body.appointment,
        username: req.body.username,
        text: req.body.text,
        attachment: req.body.attachment 
    }, (err, message) => {
        if (err) {
            console.log('SEND MSG Error: ' + err);
            return res.status(500).send('SEND MSG Error');
        } else {
            Chat.findById(req.body.appointment, (error, chat) => {
                if (error) { 
                    console.log('SET MSG REF Error: ' + error);
                    return res.status(500).send('SET MSG REF Error');
                } else {
                    chat.messagesRef.push(message._id)
                    chat.save()
                    console.log("MSG ID pushed to MessageRef");
                }
            })
            return res.status(200).json(message);
        }
    })
})

//used path parameters
router.get('/getChat/:aid', (req, res) => {

    Chat.findById(req.params.aid, (error, chat) => {
        if (error) { 
            console.log('GET CHAT Error: ' + error);
            return res.status(500).send('GET CHAT Error');
        } else {
            Message.find({ 
                '_id': { $in: chat.messagesRef}
            }, (err, messages) => {
                if(!err) {
                    return res.json(messages)
                } else {
                    console.log('GET CHAT Error: ' + error);
                    return res.status(500).send('GET CHAT Error');
                }
            })
        }
    })
})


// delete message endpoint not required
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