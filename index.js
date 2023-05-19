const express = require('express');
const { PORT } = require('./config');
const connectToDb = require('./database/index')

//Initializing App
const app = express();


//Limiting the size of Json data
app.use(express.json({ limit: "40mb" }));

connectToDb();

app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
})
