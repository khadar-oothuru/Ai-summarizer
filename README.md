# AI Meeting Notes Summarizer & Sharer

A full-stack application that uses AI to summarize meeting transcripts and share them via email.

## 🚀 Features

- **Upload Transcript Files**: Support for .txt and .md files
- **Manual Text Input**: Paste transcripts directly into the app
- **Custom AI Prompts**: Customize how the AI summarizes your content
- **Editable Summaries**: Edit the AI-generated summary before sharing
- **Email Sharing**: Send summaries to multiple recipients via email
- **Real-time Processing**: Powered by Groq's fast language models

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Groq SDK** - AI text processing
- **Nodemailer** - Email functionality
- **Multer** - File upload handling

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Groq API Key** - Get one from [Groq Console](https://console.groq.com)
3. **Gmail Account** with App Password for email functionality

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Mangodesk
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
PORT=3001
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Getting Required Credentials

#### Groq API Key
1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

#### Gmail App Password
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security
3. Under "2-Step Verification", select "App passwords"
4. Generate an app password for this application
5. Use this password (not your regular Gmail password) in the `.env` file

## 🚀 Running the Application

### Development Mode

1. **Start the Backend** (in one terminal):
```bash
cd backend
npm run dev
```

2. **Start the Frontend** (in another terminal):
```bash
cd frontend
npm run dev
```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Production Mode

1. **Build the Frontend**:
```bash
cd frontend
npm run build
```

2. **Start the Backend**:
```bash
cd backend
npm start
```

## 📱 How to Use

1. **Upload or Paste Transcript**
   - Click "Choose Text File" to upload a .txt or .md file
   - Or paste your transcript directly in the text area

2. **Add Custom Instructions** (Optional)
   - Specify how you want the AI to summarize
   - Examples:
     - "Summarize in bullet points for executives"
     - "Highlight only action items and deadlines"
     - "Focus on technical decisions made"

3. **Generate Summary**
   - Click "Generate Summary" to process with AI
   - Wait for the AI to analyze and summarize your content

4. **Edit Summary**
   - Review and edit the generated summary as needed
   - The summary is fully editable

5. **Share via Email**
   - Add recipient email addresses
   - Customize the email subject
   - Click "Send Email" to share

## 🔒 Security Notes

- API keys and email credentials are stored in environment variables
- File uploads are limited to 10MB
- Only text files (.txt, .md) are accepted for upload
- Email functionality requires proper Gmail app password setup

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to generate summary"**
   - Check your Groq API key is correct
   - Ensure you have sufficient API credits
   - Verify the transcript is not empty

2. **"Failed to send email"**
   - Verify Gmail credentials in `.env`
   - Ensure 2FA is enabled and app password is used
   - Check recipient email addresses are valid

3. **File upload fails**
   - Ensure file is under 10MB
   - Only .txt and .md files are supported
   - Check file contains valid text content

### Backend Health Check
Visit http://localhost:3001/api/health to verify the backend is running.

## 📄 API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload-transcript` - Upload transcript file
- `POST /api/summarize` - Generate AI summary
- `POST /api/send-email` - Send summary via email

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | Yes |
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASSWORD` | Gmail app password | Yes |
| `PORT` | Backend server port | No (default: 3001) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

If you encounter issues or have questions:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure both frontend and backend are running
4. Check the browser console and terminal for error messages
