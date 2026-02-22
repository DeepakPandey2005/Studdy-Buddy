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
- The "answer" field MUST be the EXACT STRING matching one of the options.
- DO NOT use labels like "A", "B", "C", "D" or indexes in the "answer" field. It must be the text of the correct option itself.
- Return ONLY valid JSON
- No markdown formatting or extra text.

Format:
{
  "mcqs": [
    {
      "question": "Question?",
      "options": ["Option 1 Text", "Option 2 Text", "Option 3 Text", "Option 4 Text"],
      "answer": "Option 1 Text"
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

    const content = response.data.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Handle cases where AI might include markdown or extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    // 🧠 3. Save to Redis (24 hrs)
    await redis.set(
      cacheKey,
      JSON.stringify(parsed),
      "EX",
      60 * 60 * 24
    );

    return res.json(parsed);
  } catch (err) {
    console.error("MCQ GENERATION ERROR:", err.response?.data || err.message);
    return res.status(500).json({ error: "AI failed to generate MCQs" });
  }


};

const generateStudyMaterial = async (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: "id and title required" });
  }

  const cacheKey = `study:material:${id}`;

  try {
    // 🔁 1. Redis check
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 🤖 2. AI call
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `
Generate comprehensive study material for the topic: "${title}".
Provide a clear explanation and curated resources like YouTube videos, GitHub repos, and articles.

Rules:
- Return ONLY valid JSON.
- No markdown formatting or extra text.
- Include at least one YouTube link and one GitHub/Documentation link.
- Description should be detailed and helpful.

Format:
{
  "topic": "${title}",
  "description": "A detailed explanation of the topic...",
  "resources": [
    {
      "type": "YouTube",
      "title": "Best Video on ${title}",
      "url": "https://youtube.com/..."
    },
    {
      "type": "GitHub",
      "title": "Useful Repository",
      "url": "https://github.com/..."
    },
    {
      "type": "Documentation",
      "title": "Official Docs",
      "url": "https://..."
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

    const content = response.data.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    // 🧠 3. Save to Redis (24 hrs)
    await redis.set(
      cacheKey,
      JSON.stringify(parsed),
      "EX",
      60 * 60 * 24
    );

    return res.json(parsed);
  } catch (err) {
    console.error("STUDY MATERIAL GENERATION ERROR:", err.response?.data || err.message);
    return res.status(500).json({ error: "AI failed to generate study material" });
  }
};


module.exports = { generateAIResponse , generateMCQ, generateStudyMaterial };