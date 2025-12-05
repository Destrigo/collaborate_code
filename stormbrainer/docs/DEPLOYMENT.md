# 🚀 Deployment Guide

This document outlines the steps for deploying the StormBrainer application. We assume the use of a cloud service like **Heroku** for the backend API and a static hosting service like **Vercel** or **Netlify** for the frontend.

## 1. ⚙️ Backend API Deployment (e.g., Heroku)

The Node.js/Express backend requires a few modifications for production:

### A. Environment Variables

Your production environment must be configured with all necessary environment variables, including:

* **`NODE_ENV=production`**
* **`PORT`**: This must be dynamic, usually set by the host (e.g., `process.env.PORT`).
* **`DATABASE_URL`**: The full connection string for your **Production PostgreSQL Database**. This is often provided by the hosting platform (e.g., Heroku Postgres).
* **`CORS_ORIGIN`**: The URL of your **deployed frontend** (e.g., `https://stormbrainer.vercel.app`).
* **`JWT_SECRET`**: A highly secure, long secret key.

### B. Database Connection Update

Ensure your `backend/config/database.js` handles production settings, specifically **SSL** for the database connection (required by many cloud hosts):

```javascript
// backend/config/database.js (Ensure this production logic is present)
const pool = new Pool({
  // ... standard config ...
  ssl: process.env.NODE_ENV === 'production' ? { 
      rejectUnauthorized: false // Required for services like Heroku to accept the connection
  } : false,
});