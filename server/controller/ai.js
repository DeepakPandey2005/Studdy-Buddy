const axios = require("axios");
const redis = require("../redis/client");
 async function generateAIResponse(req,res) {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // You can also use llama3-8b-8192
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return res.json(JSON.stringify({ content }), { status: 200 });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.json(JSON.stringify({ error: "AI failed" }), {
      status: 500,
    });
  }
}


const generateMCQ = async (req, res) => {
  const { stepId, title } = req.body;

  if (!stepId || !title) {
    return res.status(400).json({ error: "stepId and title required" });
  }


  const cacheKey = `mcq:step:${stepId}`;

  // 🔁 1. Redis check
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // 🤖 2. AI call
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // You can also use llama3-8b-8192
        messages: [
          {
            role: "user",
            content: `
Create exactly 5 multiple choice questions for the topic:
"${title}"

Rules:
- Each question must have 4 options
- One correct answer
- Return ONLY valid JSON
- No markdown

Format:
{
  "mcqs": [
    {
      "question": "Question?",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }
  ]
}
      `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // const content = response.data.choices[0].message.content;
    let parsed = response.data.content;
    console.log(response)
     while (typeof parsed === "string") {
    parsed = JSON.parse(parsed);
  }


  // 🧠 3. Save to Redis (24 hrs)
  await redis.set(
    cacheKey,
    JSON.stringify(parsed),
    "EX",
    60 * 60 * 24
  );

  res.json(parsed);
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.json(JSON.stringify({ error: "AI failed" }), {
      status: 500,
    });
  }

 
};


module.exports = { generateAIResponse , generateMCQ };