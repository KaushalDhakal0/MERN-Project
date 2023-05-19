const express = require('express');
const { PORT } = require('./config');
const connectToDb = require('./database/index')
const router = require('./routes/index');
const errorHandler = require("./middlewares/errorHandler");

//Initializing App
const app = express();


//Limiting the size of Json data
app.use(express.json({ limit: "40mb" }));

connectToDb();



app.use(router);


//Error Handling
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
})
