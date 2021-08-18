const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Pusher = require('pusher')
dotenv.config()
const app = express()
const chatApi = require('./routes/chatApi')
const Chat  = require('./models/chat')
let CHANNEL = ""

const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.APP_KEY,
    secret: process.env.APP_SECRET,
    cluster: process.env.APP_CLUSTER,
    useTLS: process.env.USE_TLS
});

// enable cors
app.use(cors())
app.options('*', cors())

//express body parser
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

//routes
app.use('/chatApi', chatApi)

//authenticating user for joining private channel
app.post('/p_auth', (req, res) => {
    console.log('received auth request');
    console.log('req.body:', req.body);
    //for passing channel name to trigger function
    CHANNEL = req.body.channel_name
    // Some logic to determine whether the user making the request has access to
    // the private channel
    Chat.findById(req.body.appointment, (error, chat) => {
        if (error || chat === null) { 
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
                console.log('You are not Authorized: ' + error);
                return res.status(500).send('You are not Authorized');
            }
        }
    })
});

//connection to database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, "Error Connecting to MongoDB: "));

db.once('open', () => {
    console.log("Connected to MongoDB: monogoRS")

    app.listen(process.env.PORT, () => {
        console.log("Node server is running on port: ", process.env.PORT)
    })
    
    const messageCollection = db.collection('messages');
    const changeStream = messageCollection.watch();
      
    changeStream.on('change', (change) => {
        console.log("Change Stream: " + change.operationType);
        
        if(change.operationType === 'insert') {
            const message = change.fullDocument;
            //pusher trigger requires internet connection else throws error/wrning
            pusher.trigger(CHANNEL, 'inserted', {
                id: message._id,
                text: message.text,
                username: message.username,
                attachment: message.attachment
            })
            .catch(err=>{
                console.log('PUSHER TRIGGER Error: ' + err);
                return res.status(500).send('PUSHER TRIGGER Error');
            })
        } else if(change.operationType === 'delete') {
            const message = change.fullDocument;
            //pusher trigger requires internet connection else throws error/warning
            pusher.trigger(CHANNEL, 'deleted', change.documentKey._id )
            .catch(err=>{
                console.log('PUSHER TRIGGER Error: ' + err);
                return res.status(500).send('PUSHER TRIGGER Error');
            })
        }
    })
})