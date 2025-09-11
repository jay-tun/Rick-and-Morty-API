# Overview

This is a Rick & Morty AI Backend application that combines a RESTful API with AI-powered features. The system allows users to manage custom characters, search the external Rick & Morty API, and interact with AI features like backstory generation, personality analysis, episode recommendations, and character chatbots. Built with Node.js and Express, it features JWT authentication, PostgreSQL database integration, and OpenAI API integration through GitHub's model inference service.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Framework**: Express.js with Node.js runtime
- **Architecture Pattern**: RESTful API with modular route-controller structure
- **File Organization**: Separated concerns with dedicated folders for routes, controllers, middleware, and database connection
- **Authentication**: JWT-based stateless authentication with bcrypt password hashing
- **Middleware**: Custom authentication middleware for protected routes

## Database Design
- **Database**: PostgreSQL with connection pooling via node-postgres (pg)
- **Schema**: Two main tables - users (authentication) and characters (user-created content)
- **User Table**: Basic user management with email/password and timestamps
- **Character Table**: Flexible character storage with optional fields for species, status, gender, origin, image, and AI-generated backstory
- **Security**: SSL-enabled database connections with environment-based configuration

## API Structure
- **Authentication Routes** (`/auth`): User registration and login
- **Character Routes** (`/characters`): CRUD operations for user-created characters (protected)
- **External API Routes** (`/external`): Proxy to Rick & Morty API for character search
- **AI Routes** (`/ai`): AI-powered features including backstory generation, personality analysis, and chatbot functionality (protected)

## AI Integration
- **Provider**: OpenAI models accessed through GitHub's model inference service
- **Model**: GPT-4.1 for text generation tasks
- **Features**: Backstory generation, Big Five personality analysis, episode recommendations, relationship predictions, and in-character chatbot interactions
- **Flexibility**: Supports both user-created characters and external API characters for AI operations

## Frontend Architecture
- **Technology**: Vanilla JavaScript with HTML/CSS
- **Structure**: Static file serving from public directory
- **Pages**: Login/registration page and character management interface
- **API Communication**: Fetch API for backend communication with JWT token handling
- **UI Features**: Character search, CRUD operations, and AI feature integration

## Security Implementation
- **Authentication**: JWT tokens with configurable secret
- **Password Security**: bcrypt hashing with salt rounds
- **Route Protection**: Middleware-based authentication for sensitive endpoints
- **CORS**: Enabled for cross-origin requests
- **Input Validation**: Basic validation for required fields and data types

# External Dependencies

## Core Backend Dependencies
- **express**: Web framework for API routing and middleware
- **pg**: PostgreSQL client for database operations with connection pooling
- **jsonwebtoken**: JWT token generation and verification for authentication
- **bcrypt**: Password hashing and verification
- **cors**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management

## AI and External Services
- **openai**: OpenAI SDK configured to use GitHub's model inference service
- **axios**: HTTP client for external API requests to Rick & Morty API

## Database Service
- **PostgreSQL**: Primary database, configured for Supabase hosting
- **Connection**: SSL-enabled connection with environment-based configuration

## External APIs
- **Rick & Morty API**: Public API for character data at rickandmortyapi.com
- **GitHub Models API**: AI model inference service using OpenAI GPT-4.1

## Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: Secret key for JWT token signing
- **GITHUB_TOKEN**: Authentication token for GitHub's AI model service
- **PORT**: Server port configuration (defaults to 5000)