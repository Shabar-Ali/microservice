const express = require("express"),
      bodyparser = require("body-parser"),
      request = require('request'),
      app = express();

const PORT = process.env.PORT || '4455';


app.use(bodyparser.urlencoded({extended: true}));

app.get('/', (req, res) =>{
    res.send("You have hit 4455")
})

app.get('/start-service', (req, res) => {
    console.log("Camunda service started");
    let display ={
        title: "camunda has been started"
    }
    res.send(display);
});


app.listen(PORT, process.env.IP, ()=>{
    console.log("server is running on port", PORT);
});