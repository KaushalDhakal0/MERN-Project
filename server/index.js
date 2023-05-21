const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit =  require('express-rate-limit');
const { PORT } = require('./config');
const cookieParser = require("cookie-parser");
const connectToDb = require('./database/index');
const router = require('./routes/index');
const errorHandler = require("./middlewares/errorHandler");


const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};
//Initializing App
const app = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
app.use(cookieParser());

app.use(
    cors({
      origin: function (origin, callback) {
        return callback(null, true);
      },
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );

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
