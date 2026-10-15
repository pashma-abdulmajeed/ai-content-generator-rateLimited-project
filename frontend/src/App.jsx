import { useState } from "react";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function App() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(event) {
    event.preventDefault();
    setError("");
    setContent("");
    setCopied(false);

    if (topic.trim().length < 3) {
      setError("Please enter a topic with at least 3 characters.");
      return;
    }

    if (topic.trim().length > 300) {
      setError("Your topic cannot exceed 300 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/content/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          type,
          tone,
          length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const validationMessage = data.errors
          ?.map((item) => item.message)
          .join(" ");

        throw new Error(
          validationMessage ||
            data.message ||
            "Unable to generate content. Please try again."
        );
      }

      setContent(data.content || "");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure your API server is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed. Please select and copy the text manually.");
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-icon">✦</span>
          <span>NexaWrite</span>
        </a>
        <span className="status-pill">
          <span className="status-dot" />
          AI CONTENT STUDIO
        </span>
      </header>

      <main className="main-container">
        <section className="hero">
          <div className="eyebrow">
            <span>✧</span> YOUR IDEAS, POWERED BY AI
          </div>

          <h1>
            Words that work.
            <br />
            <span>Ideas that connect.</span>
          </h1>

          <p className="hero-description">
            Turn your ideas into engaging content in seconds.
            Choose your style, set your tone, and let AI do the writing.
          </p>
        </section>

        <section className="workspace">
          <form className="generator-panel" onSubmit={handleGenerate}>
            <div className="panel-heading">
              <div>
                <span className="section-kicker">CONTENT GENERATOR</span>
                <h2>Create something great</h2>
              </div>
              <span className="sparkle">✳</span>
            </div>

            <label htmlFor="topic">What do you want to write about?</label>
            <textarea
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Why learning programming opens new career opportunities..."
              maxLength={300}
              rows={5}
              required
            />
            <div className="input-footer">
              <span>Be specific for better results.</span>
              <span>{topic.length}/300</span>
            </div>

            <div className="field-grid">
              <div className="field">
                <label htmlFor="type">Content type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="blog">Blog post</option>
                  <option value="social">Social media post</option>
                  <option value="email">Email</option>
                  <option value="product">Product description</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="tone">Writing tone</label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="creative">Creative</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div className="field full-width">
                <label htmlFor="length">Content length</label>
                <div className="length-options">
                  {["short", "medium", "long"].map((option) => (
                    <button
                      className={`length-button ${
                        length === option ? "selected" : ""
                      }`}
                      type="button"
                      key={option}
                      onClick={() => setLength(option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                      <span>
                        {option === "short"
                          ? "~100 words"
                          : option === "medium"
                            ? "~250 words"
                            : "~500 words"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <button className="generate-button" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Generating your content...
                </>
              ) : (
                <>
                  Generate content <span>↗</span>
                </>
              )}
            </button>

            <p className="security-note">
              <span>♧</span> Protected with input validation and rate limiting
            </p>
          </form>

          <section className="result-panel" aria-live="polite">
            <div className="result-heading">
              <div>
                <span className="section-kicker">YOUR CREATION</span>
                <h2>Generated content</h2>
              </div>
              {content && (
                <button className="copy-button" onClick={handleCopy} type="button">
                  {copied ? "✓ Copied" : "▢ Copy"}
                </button>
              )}
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="loading-orbit">
                  <span>✦</span>
                </div>
                <h3>Crafting your words...</h3>
                <p>Your content is being generated. This may take a few seconds.</p>
              </div>
            ) : content ? (
              <article className="generated-content">{content}</article>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✧</div>
                <h3>Your next great idea starts here</h3>
                <p>
                  Fill in your topic and preferences, then generate your first
                  piece of AI-powered content.
                </p>
                <div className="feature-tags">
                  <span>✦ Blog posts</span>
                  <span>✦ Emails</span>
                  <span>✦ Social posts</span>
                </div>
              </div>
            )}

            <div className="result-footer">
              <span>POWERED BY GEMINI</span>
              <span>BUILT FOR BETTER WRITING</span>
            </div>
          </section>
        </section>

        <footer className="page-footer">
          <span>© {new Date().getFullYear()} NexaWrite</span>
          <span>Thoughtful writing, made simpler.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
