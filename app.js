const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const chatApi = require('./routes/chatApi')


// enable cors
app.use(cors())

//express body parser
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

//routes
app.use('/chatApi', chatApi)
app.get('/', (req, res) => {return res.status(200).json("hello world")})

//connection to database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, "Error Connecting to MongoDB: "));

db.once('open', () => {
    console.log("Connected to MongoDB: monogoRS")
    
    //const messageCollection = db.collection('messages');
    //const changeStream = messageCollection.watch();
      
    /*changeStream.on('change', (change) => {
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
    })*/
})

app.listen(process.env.PORT, () => {
        console.log("Node server is running on port: ", process.env.PORT)
    })
