const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static('public'));

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes',(req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes',(req,res) => {
    const data = require('./db/db.json');
    res.json(data);
});

app.post('/api/notes',(req,res) => {
    const incomingData = req.body;
    const data = require('./db/db.json');
    data.push(incomingData);
    fs.writeFile('./db/db.json',JSON.stringify(data),err=>{
        if(err) {
            console.log(err);
        }
    });
    res.json('POST request handled');
});

app.listen(PORT,err=>{
    if(err) {
        console.log(err);
    } else {
        console.log('Listening at localhost:' + PORT);
    }
});