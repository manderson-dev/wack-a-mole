const express = require("express");
const path = require("path");

const port = process.env.PORT || "3002";
const app = express();

app.use(express.static('./dist'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});


app.listen(port)