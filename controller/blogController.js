const Blog = require('../models/blog');



const getAllBlogs = async (req, res,next) => {
    res.json({
        blogs:["ONE", "TWO", "THREE", "FOUR"]
    })
}


module.exports = {
    getAllBlogs,
}