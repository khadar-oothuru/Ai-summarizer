import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function main() {
  console.log("🧪 Testing Groq API integration...");

  if (
    !process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY === "your_groq_api_key_here"
  ) {
    console.log(
      "❌ Error: GROQ_API_KEY not set or still using placeholder value"
    );
    console.log("📋 To fix this:");
    console.log("1. Visit https://console.groq.com to get your API key");
    console.log(
      "2. Edit the .env file and replace 'your_groq_api_key_here' with your actual API key"
    );
    console.log("3. Run this test again");
    return;
  }

  try {
    console.log("📡 Making test request to Groq API...");
    const chatCompletion = await getGroqChatCompletion();

    const content = chatCompletion.choices[0]?.message?.content;
    if (content) {
      console.log("✅ Groq API integration successful!");
      console.log("📄 Response preview:", content.substring(0, 100) + "...");
      console.log("🔧 Model used:", chatCompletion.model);
      console.log("📊 Usage stats:", {
        prompt_tokens: chatCompletion.usage?.prompt_tokens,
        completion_tokens: chatCompletion.usage?.completion_tokens,
        total_tokens: chatCompletion.usage?.total_tokens,
      });
    } else {
      console.log("❌ Error: No content in response");
    }
  } catch (error) {
    console.log("❌ Error testing Groq API:", error.message);

    if (error.status === 401) {
      console.log("🔑 Authentication failed - check your API key");
    } else if (error.status === 429) {
      console.log("⏰ Rate limit exceeded - try again later");
    } else if (error.status === 400) {
      console.log("📝 Bad request - check the request format");
    } else {
      console.log("🌐 Network or other error occurred");
    }
  }
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content:
          "Explain the importance of fast language models in one paragraph.",
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 200,
  });
}

// Test meeting summarization specifically
export async function testMeetingSummarization() {
  console.log("\n🏢 Testing meeting summarization...");

  const sampleTranscript = `
  Meeting: Quick standup
  John: Good morning team. Let's do our daily standup.
  Sarah: I completed the user authentication feature yesterday. Today I'm working on the dashboard.
  Mike: I fixed the bug in the payment system. Planning to start on the mobile app today.
  John: Great work everyone. Any blockers?
  Sarah: Need the API documentation from Mike.
  Mike: I'll send that over after this meeting.
  John: Perfect. Meeting adjourned.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize the following meeting transcript in bullet points, highlighting key accomplishments and action items:\n\n${sampleTranscript}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 500,
    });

    const summary = chatCompletion.choices[0]?.message?.content;
    if (summary) {
      console.log("✅ Meeting summarization test successful!");
      console.log("📋 Generated summary:");
      console.log(summary);
    }
  } catch (error) {
    console.log("❌ Meeting summarization test failed:", error.message);
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => testMeetingSummarization());
}
