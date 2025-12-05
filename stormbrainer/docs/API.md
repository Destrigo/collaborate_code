# ⚡ StormBrainer API Endpoints

All endpoints are prefixed with `/api`. Access to most routes requires a valid JWT sent in the `Authorization: Bearer <token>` header.

## 🔑 Auth & Users

| Method | Endpoint | Description | Auth Required? | Body/Notes |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Create a new user account. | No | `email`, `password`, `username` |
| **POST** | `/api/auth/login` | Authenticate and receive a JWT. | No | `email`, `password` |
| **GET** | `/api/auth/me` | Get the current logged-in user's profile. | **Yes** | Returns user details and current `rating`. |
| **GET** | `/api/leaderboard` | Get the top 100 users by `rating`. | No | |

## 🪐 Galaxies

| Method | Endpoint | Description | Auth Required? | Body/Notes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/galaxies` | Get all public galaxies and all galaxies the user belongs to. | **Yes** | |
| **GET** | `/api/galaxies/:id` | Get details for a specific galaxy. | **Yes** | |
| **POST** | `/api/galaxies` | Create a new galaxy. | **Yes** | `name`, `description`, `isPublic`, `password` (if private), `category` |
| **POST** | `/api/galaxies/:id/join` | Join a public or private galaxy. | **Yes** | `password` (required for private) |

## ⭐ Problems & Solutions

| Method | Endpoint | Description | Auth Required? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/galaxies/:galaxyId/problems` | List all problems within a galaxy. | **Yes** | User must be a member. |
| **POST** | `/api/galaxies/:galaxyId/problems` | Create a new problem. | **Yes** | Requires user to be the **galaxy owner**. |
| **GET** | `/api/problems/:problemId/solutions` | List all solutions for a specific problem, sorted by stars. | **Yes** | |
| **POST** | `/api/problems/:problemId/solutions` | Submit a solution for a problem. | **Yes** | `text` (solution content). |
| **POST** | `/api/solutions/:solutionId/rate` | Upvote or downvote a solution. | **Yes** | `value`: `1` (upvote) or `-1` (downvote). Updates author's rating. |