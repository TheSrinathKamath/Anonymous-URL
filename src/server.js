"use strict"

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

/* Import Express & other dependencies */
const express = require("express");
const app = express();

const cors = require('cors')
const path = require('path');

/* Register view engine */
app.set('view engine', 'ejs');

/* Configuring express server */
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

/* Configuring IP & Ports */
const PORT = process.env.PORT || 2021;

/* Listen for requests */
app.listen(PORT, (err) => {
    console.log(`Server listening on ${PORT}`);
    if (err) console.log(err)
});

// Render main UI
app.get('/', (req, res) => {
    res.render('index');
});

// Configuring routes for links
const routes = require('./routes/index')
app.use('/link', routes);

// Configuring routes for rendering EJS
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
});
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
});
app.get('/404', (req, res) => {
    res.render('404', { title: '404' });
});
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});