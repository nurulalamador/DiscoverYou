const database = require('./config/database.js');
const express = require('express');
const routes = require('./routes/route.js');
const coockieParser = require('cookie-parser');
const cors = require('cors');

database.connect(function(error) {
    if (error) {
        console.error('Database connection failed:', error);
    } else {
        console.log('Database connected successfully.');
    }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(coockieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use('/', routes);

module.exports = app;