const router=require('express').Router();
const { get } = require('mongoose');
const { createTask,getTasks } = require('../controller/tasks.js');
const authMiddleware = require('../middleware/auth.js');

// router.post('/generate/ai',authMiddleware,generateAIResponse)
router.post('/create',authMiddleware,createTask)
.get('/get',authMiddleware,getTasks)
.patch('/step/:stepId/done', authMiddleware, require('../controller/tasks.js').markStepDone);

module.exports=router;