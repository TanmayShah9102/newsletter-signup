//jshint esversion: 6

const express = require('express');
const client = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();
const api_key = process.env.MAILCHIMP_API_KEY;

client.setConfig({
  apiKey: api_key,
  server: "us13",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
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