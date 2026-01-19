const router=require('express').Router();
const { generateAIResponse } = require('../controller/ai.js');
const authMiddleware = require('../middleware/auth.js');

// router.post('/generate/ai',authMiddleware,generateAIResponse)
router.post('/ai/response',generateAIResponse)

module.exports=router;