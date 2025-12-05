# 🌌 StormBrainer Galaxy Edition

A collaborative problem-solving platform where users create "galaxies" to share and solve challenges together.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Mobile App Development](#mobile-app-development)

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Galaxy System**: Create private or public collaborative workspaces
- **Problem Management**: Galaxy owners can post problems for members to solve
- **Solution Submission**: Members can submit and rate solutions
- **Rating System**: Star-based rating that contributes to global user scores
- **Visual Representation**: Problems displayed as planets with size based on ratings
- **Category Filtering**: Browse public galaxies by category (Math, Logic, Programming, etc.)
- **Leaderboard**: Global ranking of users by accumulated stars
- **Dark/Light Mode**: Customizable UI theme

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
stormbrainer-galaxy/
├── backend/
│   ├── server.js              # Main Express server
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (create from .env.example)
│   └── database/
│       └── schema.sql         # Database schema
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── api.js             # API service layer
│   │   └── index.js           # Entry point
│   ├── package.json           # Frontend dependencies
│   └── .env                   # Frontend environment variables
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stormbrainer-galaxy.git
cd stormbrainer-galaxy
```

### 2. Database Setup

#### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE stormbrainer;

# Exit psql
\q
```

#### Run Schema

```bash
# Navigate to backend directory
cd backend

# Run schema file
psql -U postgres -d stormbrainer -f database/schema.sql
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Configure your `.env` file:**

```env
PORT=3001
NODE_ENV=development
DB_USER=postgres
DB_HOST=localhost
DB_NAME=stormbrainer
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-generated-secret-key
CORS_ORIGIN=http://localhost:3000
```

**Generate a secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
```

## ⚙️ Configuration

### Backend Configuration

Edit `backend/.env`:

- `PORT`: Server port (default: 3001)
- `DB_*`: Database connection details
- `JWT_SECRET`: Secret key for JWT tokens (generate a secure random string)
- `CORS_ORIGIN`: Frontend URL for CORS

### Frontend Configuration

Edit `frontend/.env`:

- `REACT_APP_API_URL`: Backend API URL

## 🏃 Running the Application

### Development Mode

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Server will start at `http://localhost:3001`

#### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

App will open at `http://localhost:3000`

### Production Mode

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
# Serve the build folder with a static server
npx serve -s build
```

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "JohnDoe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Galaxy Endpoints

#### Get All Galaxies
```http
GET /api/galaxies
Authorization: Bearer <token>
```

#### Create Galaxy
```http
POST /api/galaxies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Math Challenges",
  "description": "Advanced mathematics problems",
  "isPublic": true,
  "category": "Math",
  "password": "optional-for-private"
}
```

#### Join Galaxy
```http
POST /api/galaxies/:id/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "galaxy-password"
}
```

### Problem Endpoints

#### Get Problems
```http
GET /api/galaxies/:galaxyId/problems
Authorization: Bearer <token>
```

#### Create Problem (Owner Only)
```http
POST /api/galaxies/:galaxyId/problems
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fibonacci Challenge",
  "description": "Calculate the 100th Fibonacci number"
}
```

### Solution Endpoints

#### Get Solutions
```http
GET /api/problems/:problemId/solutions
Authorization: Bearer <token>
```

#### Create Solution
```http
POST /api/problems/:problemId/solutions
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Use dynamic programming for efficiency"
}
```

#### Rate Solution
```http
POST /api/solutions/:solutionId/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 1
}
```

### Leaderboard
```http
GET /api/leaderboard
```

## 🌐 Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create stormbrainer-galaxy

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku pg:psql < database/schema.sql
```

### Railway Deployment

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub
5. Set environment variables in Railway dashboard

### Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
```bash
cd frontend
vercel
```

**Backend on Railway:**
- Connect GitHub repo
- Railway auto-detects Node.js
- Add PostgreSQL plugin
- Set environment variables

## 📱 Mobile App Development

### React Native Conversion

To convert this to a mobile app:

1. **Install React Native:**
```bash
npx react-native init StormBrainerMobile
```

2. **Install Dependencies:**
```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios react-native-async-storage
```

3. **Adapt Components:**
- Replace `div` with `View`
- Replace `button` with `TouchableOpacity`
- Replace `input` with `TextInput`
- Use `AsyncStorage` instead of `localStorage`
- Use `react-native-svg` for SVG support

4. **Navigation:**
```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
```

### Expo Alternative (Easier)

```bash
npx create-expo-app StormBrainerMobile
cd StormBrainerMobile
npm install @react-navigation/native @react-navigation/stack
expo install react-native-screens react-native-safe-area-context
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🔒 Security Considerations

- Always use HTTPS in production
- Never commit `.env` files
- Use strong JWT secrets (64+ characters)
- Implement rate limiting
- Sanitize user inputs
- Use prepared statements for SQL queries
- Enable CORS only for trusted origins

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Icons by Lucide
- UI inspiration from various modern web apps
- Community feedback and contributions

## 📞 Support

For support, email support@stormbrainer.com or open an issue on GitHub.

---

**Happy Problem Solving! 🚀🌌**