const express = require('express')
const router = express.Router()
const Pusher = require('pusher')
const Chat  = require('../models/chat')

const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.APP_KEY,
  secret: process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER,
  useTLS: process.env.USE_TLS
});

//authenticating user for joining private channel
router.post('/p_auth', (req, res) => {
    console.log('received auth request');
    console.log('req.body:', req.body);
    // Some logic to determine whether the user making the request has access to
    // the private channel
    Chat.findById(req.body.aid, (error, chat) => {
        if (error) { 
            console.log('PUSHER AUTH Error: ' + error);
            return res.status(500).send('PUSHER AUTH Error');
        } else {
            if(chat.members.includes(req.body.username)) {
                // Extract the socket id and channel name from the request body
                const socketId = req.body.socket_id;
                const channelName = req.body.channel_name;
                const auth = pusher.authenticate(socketId, channelName);
                console.log(auth)
                return res.send(auth);
            } else {
                console.log('PUSHER AUTH Error: ' + error);
                return res.status(500).send('PUSHER AUTH Error');
            }
        }
    })
});

module.exports = router