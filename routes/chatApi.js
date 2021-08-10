const Message  = require('../models/message')
const express = require('express')
const router = express.Router()

router.post('/sendMsg', (req, res) => {
    Message.create({
        appointment: req.body.appointment,
        username: req.body.username,
        text: req.body.text,
        attachment: req.body.attachment 
    }, (err, message) => {
        if (err) {
            console.log('CREATE Error: ' + err);
            return res.status(500).send('CREATE Error');
        } else {
            return res.status(200).json(message);
        }
    })
})

//used path parameters
router.get('/getMsgs/:aid', (req, res)=> {
    Message.find({appointment : req.params.aid })
    .then(messages=> {
        if(!messages) {
            return res.status(404).json({message: "No Messages found for given AppointmentID"})
        }
        res.status(200).json(messages); 
        console.log("Messages fetched for AppointmentId: " + req.params.aid )
    })
    .catch(err=>{
        console.log('GET Error: ' + err);
        return res.status(500).send('GET Error');
    })
})

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

 
module.exports = router