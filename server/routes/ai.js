const router=require('express').Router();
const { generateAIResponse, generateMCQ, generateStudyMaterial } = require('../controller/ai.js');
const authMiddleware = require('../middleware/auth.js');

// router.post('/generate/ai',authMiddleware,generateAIResponse)
router.post('/ai/response',generateAIResponse)
.post('/ai/mcq',generateMCQ)
.post('/ai/study',generateStudyMaterial)

module.exports=router;