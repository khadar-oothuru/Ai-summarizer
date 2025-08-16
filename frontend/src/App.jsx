import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiEdit,
  FiTarget,
  FiZap,
  FiMail,
  FiPlus,
  FiX,
  FiSend,
  FiUser,
  FiCopy,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiLoader,
  FiCpu,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import "./App.css";

const API_BASE_URL = "https://ai-summarizer-backend-six.vercel.app/api";

function App() {
  const [transcript, setTranscript] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipients, setRecipients] = useState([""]);
  const [emailSubject, setEmailSubject] = useState("Meeting Summary");
  const [isSending, setIsSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const downloadSummary = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "meeting-summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("transcript", file);

    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post(
        `${API_BASE_URL}/upload-transcript`,
        formData
      );
      setTranscript(response.data.transcript);
    } catch (err) {
      setError(
        "Failed to upload file: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!transcript.trim()) {
      setError("Please provide a transcript");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSummary("");

      const response = await axios.post(`${API_BASE_URL}/summarize`, {
        transcript: transcript.trim(),
        customPrompt: customPrompt.trim(),
      });

      setSummary(response.data.summary);
    } catch (err) {
      setError(
        "Failed to generate summary: " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addRecipient = () => {
    setRecipients([...recipients, ""]);
  };

  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index, value) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  };

  const sendEmail = async () => {
    const validRecipients = recipients.filter((email) => email.trim() !== "");

    if (validRecipients.length === 0) {
      setError("Please provide at least one recipient email");
      return;
    }

    if (!summary.trim()) {
      setError("Please generate a summary first");
      return;
    }

    try {
      setIsSending(true);
      setError("");
      setEmailSuccess(false);

      await axios.post(`${API_BASE_URL}/send-email`, {
        recipients: validRecipients,
        subject: emailSubject,
        summary: summary,
      });

      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setError(
        "Failed to send email: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="app">
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          <span className="header-emoji" role="img" aria-label="robo">
            🤖
          </span>
          
          AI Meeting Notes Summarizer
        </h1>
        <p>Upload transcripts, customize summaries, and share via email</p>
        <div className="dev-credit">
          <span>Developed by </span>
          <a
            href="https://github.com/khadar-oothuru"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            Khadar Oothuru
            <svg
              className="github-icon"
              height="20"
              width="20"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
              style={{ marginLeft: "6px", verticalAlign: "middle" }}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </motion.header>

      <main className="app-main">
        {/* File Upload Section */}
        <motion.section
          className="section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2>
            <FiUpload className="section-icon" /> Upload Transcript
          </h2>
          <div className="file-upload">
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              id="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              <FiFileText className="btn-icon" />
              Choose Text File
            </label>
            {isLoading && <FiLoader className="loading-icon spinning" />}
          </div>
        </motion.section>

        {/* Text Input Section */}
        <motion.section
          className="section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>
            <FiEdit className="section-icon" /> Or Paste Transcript
          </h2>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            rows={8}
            className="transcript-input"
          />
        </motion.section>

        {/* Custom Prompt Section */}
        <motion.section
          className="section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2>
            <FiTarget className="section-icon" /> Custom Instruction (Optional)
          </h2>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
            rows={3}
            className="prompt-input"
          />
        </motion.section>

        {/* Generate Button */}
        <motion.section
          className="section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            onClick={generateSummary}
            disabled={isLoading || !transcript.trim()}
            className="generate-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="btn-icon spinning" /> Generating...
              </>
            ) : (
              <>
                <HiSparkles className="btn-icon" /> Generate Summary
              </>
            )}
          </motion.button>
        </motion.section>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FiAlertCircle className="message-icon" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Section */}
        <AnimatePresence>
          {summary && (
            <motion.section
              className="section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="summary-header">
                <h2>
                  <FiFileText className="section-icon" /> Generated Summary
                </h2>
                <div className="summary-actions">
                  <motion.button
                    onClick={copyToClipboard}
                    className="action-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Copy to clipboard"
                  >
                    <FiCopy className="btn-icon" />
                  </motion.button>
                  <motion.button
                    onClick={downloadSummary}
                    className="action-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Download as text file"
                  >
                    <FiDownload className="btn-icon" />
                  </motion.button>
                </div>
              </div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={12}
                className="summary-output"
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Email Section */}
        <AnimatePresence>
          {summary && (
            <motion.section
              className="section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2>
                <FiMail className="section-icon" /> Share Summary
              </h2>

              <div className="email-form">
                <div className="form-group">
                  <label>Email Subject:</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="subject-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FiUser className="label-icon" /> Recipients:
                  </label>
                  <AnimatePresence>
                    {recipients.map((recipient, index) => (
                      <motion.div
                        key={index}
                        className="recipient-row"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <input
                          type="email"
                          value={recipient}
                          onChange={(e) =>
                            updateRecipient(index, e.target.value)
                          }
                          placeholder="email@example.com"
                          className="recipient-input"
                        />
                        {recipients.length > 1 && (
                          <motion.button
                            onClick={() => removeRecipient(index)}
                            className="remove-btn"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiX />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    onClick={addRecipient}
                    className="add-recipient-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPlus className="btn-icon" /> Add Recipient
                  </motion.button>
                </div>

                <motion.button
                  onClick={sendEmail}
                  disabled={isSending}
                  className="send-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSending ? (
                    <>
                      <FiLoader className="btn-icon spinning" /> Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="btn-icon" /> Send Email
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {emailSuccess && (
                  <motion.div
                    className="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiCheckCircle className="message-icon" /> Email sent
                    successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
