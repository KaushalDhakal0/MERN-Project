
const respond = async(res,status = 200, message="", data ="", error = "")=>{
    return res.status(status).json({
        message,
        data,
        error
    })
}

module.exports = {
    respond
}