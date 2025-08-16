import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import nodemailer from "nodemailer";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Configure nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});



app.get("/", (req, res) => {
  res.send("Welcome to Khadar's AI Meeting Notes Summarizer API");
});

// Generate summary using Groq AI
app.post("/api/summarize", async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    // Default prompt if none provided
    const defaultPrompt =
      "Summarize the following meeting transcript in a clear and organized manner, highlighting key points, decisions made, and action items:";
    const prompt = customPrompt || defaultPrompt;

    // Create the full prompt
    const fullPrompt = `${prompt}\n\nTranscript:\n${transcript}`;

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 2048,
    });

    const summary = chatCompletion.choices[0]?.message?.content;

    if (!summary) {
      throw new Error("No summary generated");
    }

    res.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      details: error.message,
    });
  }
});

// Send summary via email
app.post("/api/send-email", async (req, res) => {
  try {
    const { recipients, subject, summary } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: "Recipients are required" });
    }

    if (!summary) {
      return res.status(400).json({ error: "Summary is required" });
    }

    const transporter = createTransporter();

    // Email HTML template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          Meeting Summary
        </h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${summary}</pre>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This summary was generated using AI and may require human review.
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(", "),
      subject: subject || "Meeting Summary",
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
});

// Upload transcript file
app.post("/api/upload-transcript", upload.single("transcript"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer to text
    const transcript = req.file.buffer.toString("utf-8");

    res.json({ transcript });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      error: "Failed to process file",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
