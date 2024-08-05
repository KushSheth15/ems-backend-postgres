require('dotenv').config();
const express = require('express');
const app = express();

const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const PORT = process.env.PORT

app.use(express.json());

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/event',eventRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} 🚀`); 
})