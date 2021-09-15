const axios = require('axios')


//time delay between post reqs set to 1sec
const time = 1;

//function to keep a time delay between consecutive post request
async function waitTime(time) {
    for (let index = 0; index < 500; index++) {
        await new Promise(resolve => setTimeout(resolve, time));
    }
}

/*

//create chat
axios.post('https://chat-api-x.herokuapp.com/chatApi/createChat', {
    "appointment": "149x",
    "doctorID": "ash",
    "patientID": "john"
})
.then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res)
})
.catch(error => {
    console.error(error)
})

*/

//send 500 msg to the above created chat //each message contains 4000 character limit
for (let index = 0; index < 500; index++) {
    waitTime(time)
    //msg with 4000 char length
    axios.post('https://chat-api-x.herokuapp.com/chatApi/sendMsg', {
        "username": "john",
        "text": "this is text message: " + index,
        "appointment": "149x"
    })
    .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })
}

