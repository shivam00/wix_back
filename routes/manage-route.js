const router = require('express').Router();
const express = require('express');

var LocalStrategy = require('passport-local').Strategy;


var base64 = require('base-64');
var utf8 = require('utf8');


const app = express();
const con = require('../config/db');
var cors = require('cors');
var bodyParser = require('body-parser');
var generator = require('node-unique-id-generator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:1234'}));









module.exports = router;