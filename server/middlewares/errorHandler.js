const {ValidationError} = require('joi');
const {respond} = require("../utils/respond.js");
const errorHandler = (error, req, res, next) => {
    // default error
    let status = 500;
    let data = {
        message: 'Internal Server Error'
    }

    if (error instanceof ValidationError){
        status = 401;
        data.message = error.message;

        return res.status(status).json(data);
    }

    if (error.status){
        status = error.status;
    }

    if (error.message){
        data.message = error.message;
    }
    return respond(res,status,data?.message, null, data?.message);
}

module.exports = errorHandler;