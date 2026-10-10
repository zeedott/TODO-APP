# Todo App

A Todo application built with React and Express.js to practice CRUD operations and frontend-backend communication.

## Features

- Add and manage todos
- React-based user interface
- Express.js backend
- Toast notifications using React Toastify
- CRUD operations practice

## Tech Stack

### Frontend
- React
- Vite
- React Toastify

### Backend
- Node.js
- Express.js
- CORS

## Project Structure

```text
todo-app/
├── index.js
├── package.json
├── package-lock.json
├── route/
│   └── todo.js
└── todo-frontend/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── main.jsx
        ├── components/
        └── services/
            └── todoApi.js
```

## Getting Started

### Prerequisites

- Node.js
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/zeedott/TODO-APP.git
cd todo-app
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Start the Backend

For development:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

### 4. Install Frontend Dependencies

Open a new terminal:

```bash
cd todo-frontend
npm install
```

### 5. Start the Frontend

```bash
npm run dev
```

Open the local URL shown by Vite in your terminal.

## Available Scripts

### Backend

- `npm start` — Start the backend.
- `npm run dev` — Start the backend with Nodemon.

### Frontend

- `npm run dev` — Start the Vite development server.
- `npm run build` — Build the frontend for production.
- `npm run preview` — Preview the production build.
- `npm run lint` — Run Oxlint.

## Purpose

This project was created for learning CRUD operations, Express.js, and communication between a React frontend and a backend.

## Author

Arif
