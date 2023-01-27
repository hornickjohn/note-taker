const fs = require('fs');
const express = require('express');
const uniqid = require('uniqid');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
function SaveData(data) {
    fs.writeFile('./db/db.json',JSON.stringify(data),err=>{
        if(err) {
            console.log(err);
        }
    });
}

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
    incomingData.id = uniqid();
    data.push(incomingData);
    SaveData(data);
    res.json('POST request handled');
});

app.delete('/api/notes/:id',(req,res) => {
    const data = require('./db/db.json');
    for(let i = 0; i < data.length; i++) {
        if(data[i].id == req.params.id) {
            data.splice(i,1);
            break;
        }
    }
    SaveData(data);
    res.json('received');
});

app.listen(PORT,err=>{
    if(err) {
        console.log(err);
    } else {
        console.log('Listening at localhost:' + PORT);
    }
});