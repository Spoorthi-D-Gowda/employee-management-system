# NexusEmp — Full Stack Employee Management System

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![JWT](https://img.shields.io/badge/Security-JWT-red.svg)
![License](https://img.shields.io/badge/License-MIT-purple.svg)

NexusEmp is a state-of-the-art enterprise **Employee Management System** built with Java Spring Boot 3, Spring Security, JWT authentication, and a modern React 18 frontend with glassmorphic aesthetics.

---

## 🌟 Key Features

* **JWT-Based Authentication**: Secure stateless authentication using JSON Web Tokens.
* **Role-Based Access Control (RBAC)**:
  * 🛡️ **`ADMIN`**: Full permissions — Add, View, Edit, and Delete employee records.
  * 👤 **`USER`**: Read-only permissions — View, search, and filter employee records.
* **Department & Employment Status Support**:
  * **Departments**: `ENGINEERING`, `HR`, `MARKETING`, `FINANCE`, `SALES`, `OPERATIONS`
  * **Statuses**: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INACTIVE`
* **Real-time Search & Multi-Criteria Filtering**: Filter by department, status, and instant text search by employee name or email.
* **Backend Security Enforcement**: Authorization rules enforced via Spring Security filter chain and `@PreAuthorize` method annotations. Attempting un-permitted operations returns standard JSON `403 Forbidden` responses.
* **Modern UI & Design System**: Dark/Light mode toggle, glassmorphism card aesthetics, analytics stats cards, live form validation, and toast notification alerts.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Java 17+**
* **Node.js 18+** & **npm 9+**

---

### 1. Launch Spring Boot Backend

```bash
cd backend
# Build and run with Maven
mvn spring-boot:run
```
* **Port**: `8080`
* **H2 Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:employeedb`, User: `sa`, Password: empty)

---

### 2. Launch React Frontend

```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev
```
* **Port**: `http://localhost:3000`

---

## 🔑 Pre-seeded Evaluation Credentials

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` or `admin@company.com` | `admin123` | Full CRUD Permissions |
| **USER** | `user` or `user@company.com` | `user123` | View / Search / Filter Only |

*(Or click the **Demo Admin** / **Demo User** quick login buttons on the login page!)*

---

## 🛰️ REST API Endpoints

### Authentication APIs (`/api/auth`)
* `POST /api/auth/register` — Register a new account (`ROLE_USER` or `ROLE_ADMIN`).
* `POST /api/auth/login` — Authenticate credentials and receive Bearer JWT token.

### Employee Management APIs (`/api/employees`)
* `GET /api/employees` — Fetch employees with optional query params (`search`, `department`, `employmentStatus`).
* `GET /api/employees/{id}` — Fetch employee details by ID.
* `POST /api/employees` — Create new employee record (*ADMIN only*).
* `PUT /api/employees/{id}` — Update existing employee record (*ADMIN only*).
* `DELETE /api/employees/{id}` — Delete employee record (*ADMIN only*).
* `GET /api/employees/departments` — List available departments.
* `GET /api/employees/statuses` — List available employment statuses.

---

## 📁 Project Structure

```
Employee_Management/
├── backend/
│   ├── src/main/java/com/employeemanagement/
│   │   ├── config/ (DataInitializer seed script)
│   │   ├── controller/ (AuthController, EmployeeController)
│   │   ├── dto/ (Auth & Employee DTOs, ErrorResponse)
│   │   ├── exception/ (GlobalExceptionHandler)
│   │   ├── model/ (User, Employee, Role, Department, EmploymentStatus)
│   │   ├── repository/ (UserRepository, EmployeeRepository)
│   │   ├── security/ (JwtTokenProvider, SecurityConfig, JwtFilters)
│   │   └── service/ (AuthService, EmployeeService implementations)
│   └── src/main/resources/application.properties
└── frontend/
    ├── src/
    │   ├── components/ (Navbar, EmployeeFilter, EmployeeTable, Modals, Toast)
    │   ├── context/ (AuthContext)
    │   ├── pages/ (LoginPage, DashboardPage)
    │   ├── services/ (api.js with Axios interceptors)
    │   ├── App.jsx
    │   └── index.css (Design system & glassmorphic styling)
    └── vite.config.js
```

---

## 📜 License
This project is licensed under the MIT License.
