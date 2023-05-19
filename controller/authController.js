

const login = (req,res,next) => {
    const {name,password} = req.body;
    res.json({
        name,password
    })
}


module.exports = {
    login
}