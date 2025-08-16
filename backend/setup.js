#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Setting up AI Meeting Notes Summarizer...\n");

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, ".env");
const envExample = `# AI Meeting Notes Summarizer Environment Variables

# Required: Get your Groq API key from https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Required: Gmail credentials for sending emails
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here

# Optional: Server port (default: 3001)
PORT=3001
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envExample);
  console.log("✅ Created .env file");
} else {
  console.log("ℹ️  .env file already exists");
}

console.log("\n📋 Next Steps:");
console.log("1. Edit the .env file and add your credentials:");
console.log("   - Get Groq API key from: https://console.groq.com");
console.log("   - Set up Gmail app password (requires 2FA)");
console.log("\n2. Start the application:");
console.log("   npm run dev");
console.log("\n3. Open http://localhost:3001/api/health to test backend");
console.log("   Open http://localhost:5173 for the frontend\n");

console.log("🔧 Configuration Help:");
console.log("- Groq API: Sign up at https://console.groq.com → API Keys");
console.log(
  "- Gmail Setup: Google Account → Security → 2-Step Verification → App passwords"
);
console.log("- Documentation: See README.md for detailed setup instructions\n");

console.log("🎉 Setup complete! Edit .env and run npm run dev to start.");
