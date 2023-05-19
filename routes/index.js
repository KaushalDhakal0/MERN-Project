const express = require('express');
const {getAllBlogs} = require('../controller/blogController');
const {login,logout,refresh,register} = require('../controller/authController');


//Initialize Router Object
const router = express.Router();

//Registering User
router.post('/register', register);

//Login
router.post('/login', login);

//Logout
router.post('/logout', logout);

//Refresh
router.get('/refresh', refresh);


//Blog Routes[CRUD operations]





//Comment Routes[Create and Read Comment by blogId]




router.get('/blogs', getAllBlogs);



module.exports = router;