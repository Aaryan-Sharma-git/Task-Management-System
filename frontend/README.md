# Task Management System Frontend

This is the frontend application for the Task Management System, built with React and Vite. It provides a user interface for managing tasks, user authentication, and dashboard views.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running in Development](#running-in-development)
- [Running in Production](#running-in-production)
- [Pages](#pages)
- [Components](#components)
- [Routes](#routes)
- [Testing](#testing)
- [Deployment](#deployment)

## Prerequisites

- Node.js (v16 or higher)
- npm

## Installation

1. Clone the repository and navigate to the frontend directory:
   ```
   cd c:\Users\HP\OneDrive\Desktop\Task Management System\frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```

## Environment Variables

Create a `.env` file in the frontend root with the following sample format:

```
VITE_API_URL=http://localhost:5000
PAGINATION_LIMIT=5
```

## Running in Development

1. Ensure the backend is running (e.g., on `http://localhost:5000`).
2. Start the development server:
   ```
   npm run dev
   ```
   The app will run on `http://localhost:5173` (default Vite port).

## Running in Production

1. Build the application:
   ```
   npm run build
   ```
2. Preview the build locally:
   ```
   npm run preview
   ```
   For production deployment, serve the `dist` folder using a static server like Nginx, or deploy to platforms like Vercel, Netlify, or AWS S3.

## Pages

- **Login**: User authentication form.
- **Register**: New user registration form.
- **MainLayout**: Layout wrapper for authenticated pages.
- **PriorityTasksPage**: Displays tasks filtered by priority (high, medium, low).
- **CreateTaskPage**: Form for creating new tasks.
- **TaskDetailsPage**: View/edit individual task.

## Components

- **AuthWrapper**: Wraps authenticated routes with authentication logic.
- **SideBar**: Menu for navigation.
- **TaskCard**: Displays task summary.

## Routes

- `/` - High priority tasks (default authenticated view).
- `/tasks/medium` - Medium priority tasks.
- `/tasks/low` - Low priority tasks.
- `/tasks/create` - Create new task page.
- `/task/:id` - Task details page.
- `/login` - Login page.
- `/register` - Register page.

Routes are protected with authentication guards where necessary.

## Deployment

- Use Vercel/Netlify for easy deployment: Connect your Git repo and set environment variables.
- For custom servers: Upload the `dist` folder to your hosting provider.
