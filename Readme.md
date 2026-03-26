# Smart Workspace Booking System

## 📌 Project Overview

The Smart Workspace Booking System is a full-stack application for workspace room management, booking, and analytics. It now includes a React frontend, a Spring Boot REST API, and PostgreSQL/Supabase-ready configuration so the project can be run with a cleaner developer workflow.

---

## 🚀 Features

### 👨‍💼 Admin

* Add/Delete meeting rooms
* View room usage analytics

### 👨‍💻 Employee

* Register/Login
* View available rooms
* Book rooms
* Avoid booking conflicts

---

## 🛠 Tech Stack

* **Backend:** Java, Spring Boot
* **Frontend:** React, Axios, Bootstrap, Chart.js
* **Database:** PostgreSQL / Supabase
* **Tools:** Maven, npm, Git

---

## 🏗 Architecture

React frontend → Spring Boot REST API → Service Layer → Repository → PostgreSQL

---

## 📊 Features Implemented

* Registration and login flow
* Role-based access
* Booking conflict detection
* Analytics dashboard (Chart.js)
* Global exception handling
* Input validation
* Supabase-ready database configuration

---

## ⚙️ Setup Instructions

### 1. Backend setup

From `backend/workspace`, you can either:

Use the built-in local H2 fallback for quick development:

```bash
cd backend/workspace
./mvnw spring-boot:run
```

Or export your Supabase values and use PostgreSQL:

```bash
export SUPABASE_DB_URL='jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require'
export SUPABASE_DB_USER='your-supabase-user'
export SUPABASE_DB_PASSWORD='your-supabase-password'
cd backend/workspace
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### 2. React frontend setup

From `frontend-react`:

```bash
cd frontend-react
npm install
npm start
```

The React app starts on `http://localhost:3000`.

Optional:

```bash
cp .env.example .env
```

Then set `REACT_APP_API_BASE_URL` only if your API is not running on the default local backend URL.

### 3. Production build check

```bash
cd frontend-react
npm run build
```

```bash
cd backend/workspace
./mvnw -DskipTests compile
```

---

## 📈 Future Enhancements

* JWT Authentication
* Booking approval workflow
* Notifications
* Deployment automation

---

## 👨‍💻 Author

Saaqib A
