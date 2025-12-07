const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 7777;


app.use("/name",(rew,res)=>{
    res.send("Shantvanu Mutha");
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

