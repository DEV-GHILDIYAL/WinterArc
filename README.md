# ❄️ WinterArc — Daily Progress Tracker

WinterArc is a full-stack, modern web application designed to help users track their daily habits, routines, goals, and self-improvement progress. Built with a sleek dark UI, rich visual analytics, smooth animations, and robust backend authentication.

---

## 🚀 Tech Stack

### **Frontend**
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Animations & Icons**: Framer Motion, Lucide React, Canvas Confetti
- **Data Visualization**: Recharts
- **Routing & HTTP**: React Router v6, Axios

### **Backend**
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: MongoDB 7.0 + Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) with Cookie/Header support & bcryptjs password hashing
- **Validation**: Zod schema validation
- **Security**: Express Rate Limit, CORS, Cookie Parser

### **Infrastructure & DevOps**
- **Containerization**: Docker & Docker Compose
- **Web Server (Prod Frontend)**: NGINX (Alpine)

---

## ✨ Features

- 🎯 **Daily Task & Habit Tracking**: Log and check off daily goals with visual confetti celebrations.
- 📊 **Progress Analytics**: Interactive charts powered by Recharts to view completion trends and streak counts.
- 🔒 **Secure Authentication**: User sign-up, sign-in, and protected route middleware.
- 🎨 **Modern Dark Aesthetic**: Responsive layout with Tailwind CSS and Framer Motion micro-interactions.
- 🐳 **Docker-Ready**: Launch the entire stack (MongoDB + Backend + Frontend) in seconds using Docker Compose.

---

## 📁 Project Structure

```
WinterArc/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Server configuration
│   │   ├── controllers/     # Route logic handlers
│   │   ├── middleware/      # Auth & Rate limiting middleware
│   │   ├── models/          # Mongoose data schemas
│   │   ├── routes/          # Express API route declarations
│   │   ├── schemas/         # Zod request validation schemas
│   │   └── utils/           # Helper functions & JWT helpers
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & API service calls
│   │   ├── components/      # UI components & layouts
│   │   ├── context/         # Auth & App state providers
│   │   ├── pages/           # Application views/routes
│   │   └── types/           # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Getting Started

### **Prerequisites**
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or `yarn` / `pnpm`
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a MongoDB Atlas URI) *OR* [Docker Desktop](https://www.docker.com/)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (or copy `.env.example`):

```bash
cp .env.example .env
```

Default Environment Variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/winterarc
JWT_SECRET=winterarc_super_secret_jwt_key_2026_change_in_production
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## 🏃 Running the Application

### **Option 1: Using Docker Compose (Recommended)**

Run the entire application (Database + Backend + Frontend) with a single command:

```bash
docker-compose up --build
```

- **Frontend**: Accessible at `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:5000`
- **MongoDB**: Runs inside the isolated Docker container network on port 27017.

To stop the containers:
```bash
docker-compose down
```

---

### **Option 2: Local Manual Setup**

#### **1. Start Backend**
```bash
cd backend
npm install
npm run dev
```
The backend server will run on `http://localhost:5000`.

#### **2. Start Frontend**
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will run on `http://localhost:3000` (or `http://localhost:5173`).

---

## 📜 Available Scripts

### **Backend (`/backend`)**
- `npm run dev`: Starts the TypeScript dev server with auto-reload (`ts-node-dev`).
- `npm run build`: Compiles TypeScript files into `/dist`.
- `npm run start`: Runs the built production server (`node dist/index.js`).

### **Frontend (`/frontend`)**
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Type-checks and builds production-ready static bundle into `/dist`.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint across TypeScript and React code.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).