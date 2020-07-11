'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const dns = require('dns');
const bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

const links = [];
let id = 0;
  
// URL Shortener Microservice
app.post('/api/shorturl/new', (req, res) => {
  const { url } = req.body;
  const cleanUrl = url.replace(/´^https:?´\/\//, '');
  
  dns.lookup(cleanUrl, (err) => {
    if(err) {
      return res.json({
        error: "invalid URL"
      });
    }
    else {
      // Increment Id
      id++;
      
      // Create new array entry
      const newShortUrl = {
        original_url: url,
        short_url: id
      };
      links.push(newShortUrl);
      
      // Return new array entry
      return res.json(newShortUrl);
    }
  });
});

// Receiving id endpoint
app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  const shortUrl = links.find(link => link.id === id);
  
  if(shortUrl) {
    return res.redirect(shortUrl.original_url);
  }
  else {
    return res.json({
      error: "No short URL"
    });
  }
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});