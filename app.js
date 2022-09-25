const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 1234;
app.use(bodyParser.json());

app.get('/',(req, res, next)=>{
    res.send("Hello world!");
})
app.listen(port);