const axios = require('axios')


//time delay between post reqs set to 1sec
const time = 1;

//function to keep a time delay between consecutive post request
async function waitTime(time) {
    for (let index = 0; index < 500; index++) {
        await new Promise(resolve => setTimeout(resolve, time));
    }
}



//create chat
axios.post('http://localhost:5000/chatApi/createChat', {
    "appointment": "botTest-trial2",
    "doctorID": "ashish48@medzgo.com",
    "patientID": "nteshx@medzogo.com"
})
.then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res)
})
.catch(error => {
    console.error(error)
})




//send 500 msg to the above created chat //each message contains 4000 character limit
for (let index = 0; index < 500; index++) {
    waitTime(time)
    //msg with 4000 char length
    axios.post('http://localhost:5000/chatApi/sendMsg', {
        "username": "nteshx",
        "text": `his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.

        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.
        
        To start counting your letters, simply write or paste the text into the text area and Count characters.
        his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.
        
        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.
        
        To start counting your letters, simply write or paste the text into the text area and Count characters.
        his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.
        
        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.
        
        To start counting your letters, simply write or paste the text into the text area and Count characters.
        his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.
        
        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.
        
        To start counting your letters, simply write or paste the text into the text area and Count characters.
        his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.
        
        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.
        
        To start counting your letters, simply write or paste the text into the text area and Count characters.
        his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.
        
        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.
        
        To start counting your letters, simply write or paste the text into the text area and Count characters.his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.
        
        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.
        
        To start counting your letters, simply write or paste the text into the text area and Count characters.his is a free online calculator which counts the number of characters or letters in a text, useful for your tweets on Twitter, as well as a multitude of other applications.
        
        Whether it is Snapchat, Twitter, Facebook, Yelp or just a note to co-workers or business officials, the number of actual characters matters. What you say may not be as important as how you say it. And how many characters you use.his is a free onlinecalculatorwhich
        `,
        "appointment": "botTest-trial2"
    })
    .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })
}
