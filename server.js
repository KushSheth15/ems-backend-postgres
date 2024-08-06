require('dotenv').config();
const express = require('express');
const app = express();

const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const PORT = process.env.PORT

const {ROUTE_PREFIXES} = require("./constants/routes.constants");

app.use(express.json());

app.use(ROUTE_PREFIXES.USER, userRoutes);
app.use(ROUTE_PREFIXES.EVENT, eventRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} 🚀`); 
})