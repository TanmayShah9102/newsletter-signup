//jshint esversion: 6

const express = require('express');
// const axios = require('axios');
const https = require('https');
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: "b48548d5bf71e4304057bc3daa943649-us13",
  server: "us13",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile('D:/Learning/Web Dev Course/Newsletter-Signup/signup.html');
})

app.post('/', function(req, res) {
    
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstName, 
        lastName: lastName, 
        email: email
    }

    const run = async () => {
        try {
            const response = await client.lists.addListMember("7a7a09469f", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            res.sendFile(__dirname + "/success.html");
            console.log(response.status);
        }
        catch(err) {
            res.sendFile(__dirname + "/failure.html")
            console.log(err.status);
        }
    };

    run();

});

app.get("/success", function(req, res) {
    res.redirect("/");
});

app.get("/failure", function(req, res) {
    res.redirect("/");
});

const port = 3300;
app.listen(port, function() {
    console.log("Server listening at port " + port);
});

// API key
// b48548d5bf71e4304057bc3daa943649-us13

// List id
// 7a7a09469f