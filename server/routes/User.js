const router=require('express').Router();
const {registerUser,loginUser,getUserProfile}=require('../controller/User.js');

router.post('/register',registerUser)
.post('/login',loginUser)
.get('/profile',getUserProfile);

module.exports=router;