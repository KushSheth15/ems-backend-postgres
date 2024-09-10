require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const app = express();

const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");

require('./utils/passport');
require('./utils/fb-passport');
const PORT = process.env.PORT

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

const {ROUTE_PREFIXES} = require("./constants/routes.constants");

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use(ROUTE_PREFIXES.USER, userRoutes);
app.use(ROUTE_PREFIXES.EVENT, eventRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} 🚀`); 
})