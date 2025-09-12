# 🚀 Rick & Morty Interdimensional Character Database

A full-stack web application that combines the Rick & Morty universe with AI-powered character features. Search characters from the show, create custom characters, and use AI to bring them to life with backstories, personality analysis, and interactive chats!

## 🌐 Live Application
**Access the app at: https://rick-and-morty-api-oh0e.onrender.com**

## ✨ Features

### 🎭 Character Management
- **Search Show Characters**: Find any character from the Rick & Morty series by name or species
- **Custom Character Creation**: Design your own Rick & Morty universe characters
- **User Authentication**: Secure JWT-based login system

### 🤖 AI-Powered Features (Custom Characters Only)
- **Backstory Generation**: Create detailed character histories
- **Personality Analysis**: Big Five personality trait analysis
- **Interactive Chat**: Talk with your characters in their unique voice
- **Episode Recommendations**: Get suggestions for where your character might appear
- **Relationship Predictions**: Discover potential character relationships using embeddings

### 🎨 Rick & Morty Themed UI
- **Multiverse Design**: Space-themed gradient backgrounds with portal colors
- **Show-Accurate Humor**: Interface text written in Rick & Morty style
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Character Cards**: Beautiful cards with hover animations and glassmorphism effects
- **Custom Imagery**: Generated Rick & Morty themed graphics

---

## 📦 Deployment & Setup

### 🚀 Production Deployment (Render)
The application is currently deployed and running on Render:
- **Live URL**: https://rick-and-morty-api-oh0e.onrender.com
- **Auto-deployment**: Connected to GitHub repository for continuous deployment
- **Environment**: Production-ready with PostgreSQL database

### 🛠️ Local Development Setup

#### 1. Environment Configuration
Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://[your-database-url]
JWT_SECRET=[your-jwt-secret]
GITHUB_TOKEN=[your-github-token]
PORT=3000
```

#### 2. Database Setup
PostgreSQL database with the following schema:

```sql
-- Users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Characters table for custom character storage
CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT,
  status TEXT,
  gender TEXT,
  origin TEXT,
  image TEXT,
  backstory TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Start Development Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

### 📋 Dependencies

```json
{
  "express": "Web framework",
  "pg": "PostgreSQL client", 
  "jsonwebtoken": "JWT authentication",
  "bcrypt": "Password hashing",
  "openai": "AI integration via GitHub Models",
  "axios": "HTTP requests",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables"
}
```

---

## 🌐 Using the Web Interface

### Landing Page (https://rick-and-morty-api-oh0e.onrender.com)
1. **Character Search**: Use the search bar to find Rick & Morty show characters
2. **User Registration**: Create a new account to access custom character features
3. **Login**: Sign in to manage your custom characters

### Character Lab (`/characters.html`)
1. **Create Characters**: Fill out the character creation form
2. **View Collection**: See all your custom characters in beautiful cards
3. **AI Features**: Use the buttons on each character card to:
   - Generate backstories
   - Analyze personality
   - Chat with characters
   - Get episode recommendations
   - Discover relationships

---

## 🏗️ Architecture

- **Backend**: Node.js + Express.js RESTful API
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: OpenAI GPT-4 via GitHub Models API
- **Frontend**: Vanilla JavaScript with Rick & Morty themed CSS
- **External API**: Rick & Morty API proxy for character search
- **Deployment**: Production deployment on Render with auto-deploy from GitHub

---

## 🎯 Current Status

- ✅ **Styled Frontend**: Complete Rick & Morty themed UI
- ✅ **Character Search**: Working with Rick & Morty API
- ✅ **User Authentication**: Fully functional
- ✅ **Custom Characters**: Create, read, update, delete
- ✅ **AI Features**: Working for custom characters only
- ⚠️ **AI + Show Characters**: Currently disabled (in development)

---

## 🚨 Known Issues

- AI features (backstory, personality, chat, etc.) only work with custom user-created characters
- Show characters from the Rick & Morty API cannot use AI features yet
- This limitation is clearly communicated in the user interface

---

*"Wubba Lubba Dub Dub! Science isn't about why, it's about why not!" - Rick Sanchez*