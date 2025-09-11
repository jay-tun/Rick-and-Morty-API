# Rick & Morty AI Backend

## 🚀 Features
- User auth (register/login via JWT)
- Characters CRUD
- External API proxy (Rick & Morty API)
- AI Features:
  - Backstory generation
  - Personality analysis (Big Five)
  - Episode recommendations
  - Relationship predictor (embeddings)
  - In-character chatbot

---

## 📦 Setup
#### 1. Clone repo:

    git clone https://github.com/jay-tun/Rick-and-Morty-API.git
    cd Rick-and-Morty-API

#### 2. Install dependencies:

    npm install
    
#### 3. Configure `.env`:
    
    DATABASE_URL=postgresql://postgres:[password]@host:5432/postgres
    JWT_SECRET=supersecret
    GITHUB_TOKEN=ghp_yourkey
    PORT=3000
    
#### 4. Setup database in Supabase (PostgreSQL):
    
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    );

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

---

## ▶️ Run server

    npm run start

Or in dev mode after installing `npm install nodemon` (Recommended)

    npm run dev

The API will be available at http://localhost:3000.

---

## 🔍 Test API

#### Register
    
    curl -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"123"}'

#### Login
    
    curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"123"}'

Copy the `token` from response.

#### Generate Backstory
    
    curl -X POST http://localhost:3000/ai/backstory \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"characterId": 1}'

#### Chat with Character
    
    curl -X POST http://localhost:3000/ai/chat \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"characterId": 1, "message": "How's your school, Morty?"}'
