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

//Home path responds with home page html
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//Notes path responds with notes page html
app.get('/notes',(req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//getting notes api path responds with entire json content
app.get('/api/notes',(req,res) => {
    const data = require('./db/db.json');
    res.json(data);
});

//posting notes api path takes json object, adds to db.json, responds with new object
app.post('/api/notes',(req,res) => {
    const incomingData = req.body;
    const data = require('./db/db.json');
    incomingData.id = uniqid();
    data.push(incomingData);
    SaveData(data);
    res.json(incomingData);
});

//delete notes api with path parameter removes object with id = pathparam from json, responds with status on whether item found and deleted or not
app.delete('/api/notes/:id',(req,res) => {
    const data = require('./db/db.json');
    let found = false;
    for(let i = 0; i < data.length; i++) {
        if(data[i].id == req.params.id) {
            data.splice(i,1);
            found = true;
            break;
        }
    }
    SaveData(data);

    //response
    if(found) {
        res.send('Note deleted.');
    } else {
        res.status(404).send('Note not found to delete.');
    }
});

app.listen(PORT,err=>{
    if(err) {
        console.log(err);
    } else {
        console.log('Listening at port: ' + PORT);
    }
});