const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const errorHandler = require('errorhandler');

//Initiate our app
const app = express();

//Configure our app
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));

if (!process.env.NODE_ENV) {
    app.use(errorHandler());
}

require('./config/passport');
app.use(require('./routes'));

//Error handlers & middlewares
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: err
        }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
