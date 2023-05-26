const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request=require('request');
const https=require('https');
const port = process.env.PORT||3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");

});

app.post('/', (req, res) => {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.Email;


    const data={
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName,
            }
        }]
    };

    const members=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/38372d5e78";
    const options={
        method:"POST",
        auth:"karthik:213082fd8b0f5a60ee1f588adc3421e7-us21"
    };

    const request=https.request(url,options,(response)=>{
        if(response.statusCode===200)
        {
            res.sendFile(__dirname+'/success.html')
        }
        else
        {
            res.sendFile(__dirname+'/failure.html')
        }
        
        response.on('data',(data)=>{
            //  console.log(JSON.parse(data));
        });
        
    });

    request.write(members);
    request.end();

});

app.post('/failure',(req,res)=>{
   res.redirect('/');
})

app.listen(port, () => {
    console.log("server is running at port " + port);
});
