const express = require('express');
const { PORT } = require('./config');
const cookieParser = require("cookie-parser");
const connectToDb = require('./database/index')
const router = require('./routes/index');
const errorHandler = require("./middlewares/errorHandler");


// const corsOptions = {
//   credentials: true,
//   origin: ["http://localhost:3000"],
// };
//Initializing App
const app = express();
app.use(cookieParser());

// app.use(
//     cors({
//       origin: function (origin, callback) {
//         return callback(null, true);
//       },
//       optionsSuccessStatus: 200,
//       credentials: true,
//     })
//   );

//Limiting the size of Json data
app.use(express.json({ limit: "40mb" }));
app.use(router);

connectToDb();

app.use("/storage", express.static("storage"));

//Error Handling
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
})
