const connection = require('./lib/connection');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const bodyParser = require('body-parser');
const cors = require('./node_modules/cors');

const HOUR = 1000 * 60 * 60

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
}));

const storeOptions = {
    clearExpired: true
}

const sessionStore = new MySQLStore(storeOptions, connection);

const {
    PORT = 8000,
    SESSION_AGE = HOUR * 24,
    SESSION_NAME = 'sid',
    SESSION_SECRET = 'this is a secret, shhh'
} = process.env

app.use(session({
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: sessionStore,
    cookie: {
        maxAge: SESSION_AGE,
        sameSite: true
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'applicationlication/json' }));

require("./routes/app.routes")(app);

app.listen(PORT, () => console.log(
    `App Running on ${PORT}`
));