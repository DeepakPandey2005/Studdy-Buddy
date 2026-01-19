const axios = require("axios");

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

module.exports = { generateAIResponse };