

const axios = require("axios");
const { User } = require("../model/user");
const { Task } = require("../model/tasks");

/**
 * Robust AI response extractor
 * Handles:
 * - string JSON
 * - { content: string }
 * - { content: { steps: [] } }
 * - nested / double encoded JSON
 */
function extractStepsFromAI(data) {
  let current = data;

  while (current) {
    // If string → parse
    if (typeof current === "string") {
      current = JSON.parse(current);
      continue;
    }

    // If steps found → return
    if (Array.isArray(current.steps)) {
      return current.steps;
    }

    // If wrapped in content → unwrap
    if (current.content) {
      current = current.content;
      continue;
    }

    break;
  }

  throw new Error("AI steps format invalid");
}

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ Create task first (AI should never block task creation)
    const task = new Task({
      title,
      description,
      dueDate,
      userId: req.user.id,
      steps: [],
    });

    await task.save();

    // 2️⃣ Generate AI steps
    let aiSteps = [];

    try {
      const aiResponse = await axios.post(
        "http://localhost:5000/api/generate/ai/response",
        {
          prompt: `
Break the following task into exactly 5 clear, actionable steps.

Task Title: ${title}
Task Description: ${description}

Return ONLY valid JSON.
Do NOT wrap in markdown.
Use this exact format:

{
  "steps": [
    { "title": "Step 1" },
    { "title": "Step 2" },
    { "title": "Step 3" },
    { "title": "Step 4" },
    { "title": "Step 5" }
  ]
}
          `,
        }
      );

      console.log("FULL AI RESPONSE:", aiResponse.data);

      const stepsArray = extractStepsFromAI(aiResponse.data);

      aiSteps = stepsArray.map(step => ({
        title: step.title,
        isDone: false,
      }));

    } catch (aiError) {
      console.error("AI STEP GENERATION FAILED:", aiError.message);
      // Task still continues without steps
    }

    // 3️⃣ Save steps
    task.steps = aiSteps;
    await task.save();

    // 4️⃣ Attach task to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { tasks: task._id },
    });

    // 5️⃣ Response
    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("tasks");
    res.json(user.tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markStepDone = async (req, res) => {
  try {
    const { stepId } = req.params;

    // Find task containing this step and update it
    const task = await Task.findOneAndUpdate(
      { "steps._id": stepId },
      { 
        $set: { 
          "steps.$.isDone": true,
          "steps.$.completedAt": new Date()
        } 
      },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: "Step not found" });
    }

    res.json({ message: "Step marked as done", task });
  } catch (error) {
    console.error("MARK STEP DONE ERROR:", error);
    res.status(500).json({ error: "Failed to update step" });
  }
};
