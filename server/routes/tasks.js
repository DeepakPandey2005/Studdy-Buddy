const router=require('express').Router();
const { get } = require('mongoose');
const { createTask,getTasks } = require('../controller/tasks.js');
const authMiddleware = require('../middleware/auth.js');

// router.post('/generate/ai',authMiddleware,generateAIResponse)
router.post('/create',authMiddleware,createTask)
.get('/get',authMiddleware,getTasks);


module.exports=router;