const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Pusher = require('pusher')
dotenv.config()
const app = express()
const chatApi = require('./routes/chatApi')
const channelAuth = require('./routes/channelAuth')

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
app.use('/channelAuth', channelAuth)

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
            //pusher trigger requires internet connection else throws error
            //It means data will be saved on mongoDB but wouldn't pushed to the pusher
            //Solution: Whenever this happens frontend can directly fetch data from mongoDB
            //          and update it using unique "MSG _id"
            pusher.trigger(process.env.CHANNEL, 'inserted', {
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
            //pusher trigger requires internet connection else throws error
            //It means data will be saved on mongoDB but wouldn't pushed to the pusher
            //Solution: Whenever this happens frontend can directly fetch data from mongoDB
            //          and update it using unique "MSG _id"
            pusher.trigger(process.env.CHANNEL, 'deleted', change.documentKey._id )
            .catch(err=>{
                console.log('PUSHER TRIGGER Error: ' + err);
                return res.status(500).send('PUSHER TRIGGER Error');
            })
        }
    })
})