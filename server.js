const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.send("This is Sequelize app");
});

app.listen(6060,()=>{
    console.log("Server is running on port 6060"); 
})