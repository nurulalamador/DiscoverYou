const database = require('./config/database.js');
const express = require('express');
const routes = require('./routes/route.js');

database.connect(function(error) {
    if (error) {
        console.error('Database connection failed:', error);
    } else {
        console.log('Database connected successfully.');
    }
});

const app = express();

app.use('/', routes);

module.exports = app;