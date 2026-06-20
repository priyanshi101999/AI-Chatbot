# AI Chat Assistant

A full-stack AI-powered chatbot application built using **React**, **FastAPI**, and **Google Gemini 2.5 Flash**. The application provides an interactive chat interface with conversation history support, allowing users to have context-aware conversations with an AI assistant.

## Features

* AI-powered chat using Google Gemini 2.5 Flash
* FastAPI backend with REST API architecture
* React-based responsive frontend
* Conversation history support for contextual responses
* Request validation using Pydantic
* Secure API key management using environment variables
* CORS-enabled frontend and backend communication
* Clean and structured AI responses

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Axios
* CSS

### Backend

* FastAPI
* Python
* Pydantic
* Google Gemini API
* Python Dotenv

## Backend Features

* REST API endpoint for AI chat interactions
* Conversation history management
* Prompt engineering with system instructions
* Gemini API integration
* Input validation through Pydantic models
* Environment-based configuration

### API Endpoint

```http
POST /chat
```

Request:

```json
{
  "message": "What is FastAPI?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?"
    }
  ]
}
```

Response:

```json
{
  "reply": "FastAPI is a modern Python web framework..."
}
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ai-chat-assistant
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Run backend:

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```


## Author

Priyanshi Tripathi
Full Stack Developer | Python | FastAPI | React
