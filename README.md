# ✨ AI Content Generator — Rate Limited

A full-stack AI-powered content generation application built with **React, Vite, Node.js, Express, and Google Gemini API**. Generate blog posts, social media content, emails, and product descriptions through a clean, responsive user interface.

The backend includes input validation, rate limiting, security headers, and centralized error handling to help protect the API.

## 🚀 Features

### Frontend
- Modern, responsive React user interface
- AI-powered content generation
- Multiple content formats
- Customizable writing tone and content length
- Real-time loading and error states
- Copy generated content to clipboard
- Input length validation
- Responsive layout for desktop and mobile

### Backend
- REST API built with Node.js and Express
- Google Gemini API integration
- Request validation with `express-validator`
- Rate limiting with `express-rate-limit`
- Security headers using Helmet
- Configurable CORS
- Centralized error handling
- Health-check endpoint
- Environment-based configuration
- JSON request body size limit

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS3
- Fetch API

**Backend**
- Node.js
- Express.js
- Google Gemini API
- `@google/genai`
- `express-validator`
- `express-rate-limit`
- Helmet
- CORS
- dotenv

## 📁 Project Structure

```text
ai-content-generator/
│
├── backend/
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── contentRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.local
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- Git
- A Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/pashma-abdulmajeed/ai-content-generator-rateLimited-project.git
cd ai-content-generator
```

### 2. Configure the Backend

Open a terminal in VS Code:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_available_gemini_model
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend runs at `http://localhost:5000` by default.

### 3. Configure the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

**Important:** Run the frontend and backend in separate terminals. Both must be running for content generation to work.

## 🔌 API Documentation

### Health Check

**Endpoint:** `GET /api/health`

Checks whether the backend is running.

Example response:

```json
{
  "success": true,
  "status": "healthy"
}
```

### Generate Content

**Endpoint:** `POST /api/content/generate`

Generates AI content based on the submitted topic and preferences.

**Request body:**

```json
{
  "topic": "Benefits of learning programming",
  "type": "blog",
  "tone": "friendly",
  "length": "short"
}
```

**Supported content types**

| Type | Description |
|---|---|
| `blog` | Structured blog post |
| `social` | Social media content |
| `email` | Email draft |
| `product` | Product description |

**Supported tones**

- `professional`
- `friendly`
- `creative`
- `formal`

**Supported lengths**

- `short` — approximately 100 words
- `medium` — approximately 250 words
- `long` — approximately 500 words

**Successful response example:**

```json
{
  "success": true,
  "content": "Your generated content appears here...",
  "meta": {
    "type": "blog",
    "tone": "friendly",
    "length": "short"
  }
}
```

Exact generated content and word counts may vary.

## 🛡️ Security and Rate Limiting

- Request bodies are validated before processing.
- The generation endpoint allows up to 10 requests per 15-minute window per client IP by default.
- Helmet adds HTTP security headers.
- CORS restricts browser access to configured origins.
- JSON request bodies are limited to 20 KB.
- API credentials are stored in environment variables.
- Error responses avoid exposing detailed internal server errors.

Rate limiting is an additional protection, not a guarantee against abuse. Production deployments should also configure appropriate provider quotas, monitoring, and persistent rate-limit storage if multiple server instances are used.

## 🧪 Testing

Test the following features before deployment:

- Open the frontend successfully.
- Generate content using each supported content type.
- Test the different writing tones and lengths.
- Verify validation errors for invalid input.
- Confirm the copy-to-clipboard feature works.
- Test