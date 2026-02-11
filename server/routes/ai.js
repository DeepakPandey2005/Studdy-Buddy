const router=require('express').Router();
const { generateAIResponse, generateMCQ,  } = require('../controller/ai.js');
const authMiddleware = require('../middleware/auth.js');

// router.post('/generate/ai',authMiddleware,generateAIResponse)
router.post('/ai/response',generateAIResponse)
.post('/ai/mcq',generateMCQ)

module.exports=router;