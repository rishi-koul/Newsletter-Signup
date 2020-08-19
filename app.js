// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
// Now as image and css are local in order to use them in our sever
// we need to use this special express function and transfer all
// static folder to a folder named public
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // console.log(firstName + lastName + email);

  // mailchimp needs data in this format check on web for detail
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  url = "https://us17.api.mailchimp.com/3.0/lists/c947f482c9";


  // This is going to look diff cause now we have to POST info via an api not GET info. So u need auth
  // For mailchimp auth was anyname colon apikey
  // auth might be diff for other api

  const options = {
    method:"POST",
    auth: "anystring:7c65d2a7b62763126011255a84257d92-us17"
  };

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });


  request.write(jsonData);
  request.end();


});

app.post("/failure", function(req, res){
  res.redirect("/");
});

// dont write any specific port so that it works seamlessly with heroku
app.listen(process.env.PORT || 3000, function(){
  console.log("Running....");
});



// 7c65d2a7b62763126011255a84257d92-us17


// 2c0ddbe128
// c947f482c9
