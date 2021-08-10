const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Pusher = require('pusher')
dotenv.config()
const app = express()
const chatApi = require('./routes/chatApi')
const bodyParser = require('body-parser')

const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.APP_KEY,
    secret: process.env.APP_SECRET,
    cluster: process.env.APP_CLUSTER,
    useTLS: process.env.USE_TLS
});

//different channels for different users
const channel = 'messages'

// enable cors
app.use(cors())
app.options('*', cors())

//express body parser
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use('/chatApi', chatApi)

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
        console.log(change);
        
        if(change.operationType === 'insert') {
            const message = change.fullDocument;
            pusher.trigger(channel, 'inserted', {
                id: message._id,
                text: message.text,
                username: message.username,
                attachment: message.attachment
            })
        } else if(change.operationType === 'delete') {
            const message = change.fullDocument;
            pusher.trigger(channel, 'deleted', change.documentKey._id )
        }
    })
})