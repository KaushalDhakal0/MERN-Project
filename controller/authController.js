const bcrypt = require("bcrypt");
const User = require("../models/user");

const login = async(req,res,next) => {
    const {name,password, username, email} = req.body;
    try{
        const hashedPasswd = await bcrypt.hash(password,10);
        // console.log("Hashed", hashedPasswd);
        const newUser = new User({
            username,
            email,
            name,
            password: hashedPasswd
        });
        const user = await newUser.save();

        res.json({
            user
        })

    }catch(error){
        console.log("Error Occured",error);
    }


    
}


module.exports = {
    login
}