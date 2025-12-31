# Task Management System Backend

This is the backend API for the Task Management System, built with Node.js, Express, and MongoDB. It provides endpoints for managing tasks, users, and authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running in Development](#running-in-development)
- [Running in Production](#running-in-production)
- [API Routes](#api-routes)
- [Models](#models)
- [Testing](#testing)
- [Deployment](#deployment)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
   ```
   cd c:\Users\HP\OneDrive\Desktop\Task Management System\backend
   ```
2. Install dependencies:
   ```
   npm install
   ```

## Environment Variables

Create a `.env` file in the backend root with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## Running in Development

1. Start MongoDB locally or ensure your cloud instance is running.
2. Run the server:
   ```
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

## Running in Production

1. Set `NODE_ENV=production` in your `.env` file.
2. Build the application (if applicable):
   ```
   npm run build
   ```
3. Start the server:
   ```
   npm start
   ```
   For production deployment, consider using PM2, Docker, or a cloud service like Heroku/AWS. Ensure MongoDB is configured for production (e.g., via MongoDB Atlas).

## API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and return JWT token
- `GET /api/auth/me` - Get current user info (requires auth)

### Tasks

- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task by ID
- `PUT /api/tasks/:id` - Update a task by ID
- `DELETE /api/tasks/:id` - Delete a task by ID

### Users

- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user profile

All routes except `/api/auth/register` and `/api/auth/login` require authentication via JWT token in the `Authorization` header.

## Models

### User Model

```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  role: String, // e.g., 'user' or 'admin'
  createdAt: Date
}
```

### Task Model

```javascript
{
  title: String,
  description: String,
  status: String, // e.g., 'pending', 'in-progress', 'completed'
  priority: String, // e.g., 'low', 'medium', 'high'
  dueDate: Date,
  userId: ObjectId, // reference to User
  createdAt: Date
}
```
