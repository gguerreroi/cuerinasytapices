"use strict";
import express from "express";
import morgan from "morgan";
import appRoutes from "./routes/appRoutes";
import apiRoutes from "./routes/apiRoutes";
import sequelizeSession  from "./controllers/system/sessionApp"
import error404 from "./controllers/system/error404";
import error500 from "./controllers/system/error500";

const session = require('express-session');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const app = express();

const SequelizeStore = require('connect-session-sequelize')(session.Store);

app.set('port', Number(process.env.APP_PORT) || 3010);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser('4DtpfGYjgJBdKshMKjnS'))
app.use(fileUpload())
app.use(session({
    secret: '4DtpfGYjgJBdKshMKjnS',
    resave: true,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelizeSession
    })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use("/", appRoutes);
app.use("/api", apiRoutes);

app.use(express.static(path.join(__dirname, '../public')));

app.use(error500)
app.use(error404)

export default app;