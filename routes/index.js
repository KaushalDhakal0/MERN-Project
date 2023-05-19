const express = require('express');
const cors = require('cors');
const auth = require("../middlewares/auth");
const {AuthController, blogController, commentController} = require("../controller");



//Initialize Router Object
const router = express.Router();

//Registering User
router.post('/register', AuthController.register);

//Login
router.post('/login', AuthController.login);

//Logout
router.post('/logout',auth, AuthController.logout);

//Refresh
router.get('/refresh', AuthController.refresh);


router.post('/blog', auth, blogController.create);

// get all
router.get('/blog/all', auth, blogController.getAll);

// get blog by id
router.get('/blog/:id', auth, blogController.getById);

// update
router.put('/blog', auth, blogController.update);

// delete
router.delete('/blog/:id', auth, blogController.delete);

// comment
// create 
router.post('/comment', auth, commentController.create);

// get 
router.get('/comment/:id', auth, commentController.getById);




module.exports = router;