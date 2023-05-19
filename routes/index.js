const express = require('express');
const {getAllBlogs} = require('../controller/blogController');
const {login} = require('../controller/authController');
//Initialize Router Object

const router = express.Router();

//Authentication Routes[login,register,logout,refresh]
router.post('/login', login)



//Blog Routes[CRUD operations]





//Comment Routes[Create and Read Comment by blogId]




router.get('/blogs', getAllBlogs);



module.exports = router;