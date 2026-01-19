const router=require('express').Router();
const {registerUser,loginUser,getUserProfile}=require('../controller/User.js');
const authMiddleware = require('../middleware/auth.js');

router.post('/register',registerUser)
.post('/login',loginUser)
.get('/profile',authMiddleware,getUserProfile);

module.exports=router;