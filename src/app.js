const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 7777;
const connectDB=require('./config/db.js');
const {User}=require("./models/user.model.js");
const validateSignUp=require("./utils/validateSignUp.js");
const bcrypt = require('bcrypt');
app.use(express.json());
const jwt = require('jsonwebtoken');
const cookie= require('cookie-parser');
const userAuth=require('./middleware/auth.middleware.js').userAuth;

const authRouter=require('./routes/auth.router.js');
const profileRouter=require('./routes/profile.router.js');
const requestRouter=require('./routes/request.router.js');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDB()
.then(() => {
    console.log("database is connected successfullyy");
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})})
.catch((err) => {
    console.error('Failed to connect to the database', err);
});

