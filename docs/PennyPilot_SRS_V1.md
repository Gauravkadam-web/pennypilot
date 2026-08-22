# Software Requirements Specification (SRS)

## PennyPilot — Core Expense Tracker

| | |
|---|---|
| **Document Type** | Software Requirements Specification |
| **Product** | PennyPilot |
| **Version** | V1.0 |
| **Status** | Draft for V1 Release |
| **Prepared For** | PennyPilot Engineering |

---

## Table of Contents

1. Introduction
2. Overall Description
3. Tech Stack
4. System Architecture
5. Folder Structure
6. Functional Requirements
7. Data Model / Database Schema
8. API Design
9. Non-Functional Requirements
10. Error Handling Standards
11. Testing Requirements
12. CI/CD & Deployment
13. Assumptions & Constraints
14. Out of Scope (Deferred to Future Versions)
15. Acceptance Criteria

---

# 1. Introduction

## 1.1 Purpose

This document specifies the software requirements for **PennyPilot Version 1 (V1) — Core Expense Tracker**, the first release in the PennyPilot product roadmap. It defines the functional and non-functional requirements, system architecture, database schema, API contracts, and engineering standards needed to design, build, test, and deploy V1 as a complete, production-ready product.

## 1.2 Scope

PennyPilot V1 allows a single user to create, view, update, delete, and filter personal expenses through a web application backed by a REST API and a relational database. V1 does **not** include authentication, multi-user support, income tracking, accounts/payment methods, or AI features — these are addressed in later versions (V2–V14) per the Product Roadmap.

## 1.3 Intended Audience

- Backend engineers (Spring Boot / Java)
- Frontend engineers (React / Vite)
- QA engineers
- DevOps engineers
- Product stakeholders

## 1.4 Definitions & Abbreviations

| Term | Meaning |
|---|---|
| SRS | Software Requirements Specification |
| DTO | Data Transfer Object |
| CRUD | Create, Read, Update, Delete |
| REST | Representational State Transfer |
| API | Application Programming Interface |
| CI/CD | Continuous Integration / Continuous Deployment |
| ORM | Object-Relational Mapping |

## 1.5 References

- `PRODUCT_ROADMAP.md` — PennyPilot Product Roadmap (Versions 1–14)
- `pennypilotfolderStructure.txt` — Approved project folder structure

---

# 2. Overall Description

## 2.1 Product Perspective

PennyPilot V1 is a standalone, single-user web application composed of three deployable units:

1. **Backend** — Spring Boot REST API service
2. **Frontend** — React (Vite) single-page application
3. **Database** — PostgreSQL relational database

## 2.2 Product Functions (Summary)

- Create, read, update, and delete expenses
- Categorize expenses using a fixed set of categories
- Filter expenses by category and date
- View a basic summary (total amount, count of expenses)
- Responsive web dashboard

## 2.3 User Classes

| User Class | Description |
|---|---|
| End User | Single user managing personal expenses (no login in V1) |

## 2.4 Operating Environment

- Backend: JVM 17+, containerized via Docker
- Frontend: Modern evergreen browsers (Chrome, Firefox, Edge, Safari)
- Database: PostgreSQL 15+
- Deployment: Docker containers orchestrated via CI/CD pipeline (GitHub Actions)

## 2.5 Design & Implementation Constraints

- REST APIs must return standard HTTP status codes.
- All API request/response payloads must be DTO-based (no entity leakage).
- All exceptions must be handled through a centralized global exception handler.
- No authentication is implemented in V1 (explicitly deferred to V5).

---

# 3. Tech Stack

## 3.1 Backend

| Layer | Technology |
|---|---|
| Language | Java 17+ |
| Framework | Spring Boot 3.x |
| Web | Spring Web (REST Controllers) |
| Persistence | Spring Data JPA / Hibernate |
| Database Driver | PostgreSQL JDBC Driver |
| Build Tool | Maven (`pom.xml`) |
| Validation | Jakarta Bean Validation (`spring-boot-starter-validation`) |
| API Documentation | springdoc-openapi (Swagger UI) |
| Mapping | MapStruct or manual mapper (`ExpenseMapper`) |
| Testing | JUnit 5, Mockito, Spring Boot Test, Testcontainers (optional for repository tests) |
| Containerization | Docker |

## 3.2 Frontend

| Layer | Technology |
|---|---|
| Framework | React 18+ |
| Build Tool | Vite |
| HTTP Client | Axios or Fetch API (`services/api.js`) |
| Styling | Plain CSS (`styles/`) — component/utility based |
| State Management | React Context (`AppContext.jsx`) + local component state |
| Routing | React Router (for `Dashboard`, `Expenses`, `NotFound`) |
| Custom Hooks | `useExpenses.js` for data fetching abstraction |

## 3.3 Database

- **PostgreSQL 15+**
- Schema-managed via versioned SQL migration files (`database/migrations`)

## 3.4 Infrastructure & DevOps

| Concern | Tool |
|---|---|
| Containerization | Docker (`backend/Dockerfile`, `frontend/Dockerfile`) |
| CI Pipeline | GitHub Actions (`.github/workflows/ci.yml`) |
| API Testing | Postman collection (`postman/`) |
| Source Control | Git / GitHub |

---

# 4. System Architecture

## 4.1 High-Level Architecture

```text
                +-------------------+
                |   React Frontend  |
                |  (Vite SPA, :5173)|
                +---------+---------+
                          |
                          |  REST (JSON over HTTPS)
                          v
                +-------------------+
                | Spring Boot API   |
                |  (Backend, :8080) |
                +---------+---------+
                          |
                          |  JDBC (Spring Data JPA)
                          v
                +-------------------+
                |   PostgreSQL DB   |
                +-------------------+
```

## 4.2 Backend Layered Architecture

```text
Controller  -->  Service  -->  Repository  -->  Database
    |               |
    v               v
   DTO            Entity
    |               ^
    +---- Mapper ----+
```

- **Controller** (`ExpenseController`): Handles HTTP requests, delegates to service, returns DTOs.
- **Service** (`ExpenseService`): Business logic, orchestration, transaction boundaries.
- **Repository** (`ExpenseRepository`): Spring Data JPA interface for persistence.
- **Mapper** (`ExpenseMapper`): Converts between `Expense` entity and DTOs.
- **Exception Handling** (`GlobalExceptionHandler`): Centralized error responses.

## 4.3 Frontend Architecture

```text
main.jsx
  └── App.jsx (Router)
        └── MainLayout.jsx
              ├── Dashboard.jsx        → summary widgets
              ├── Expenses.jsx         → ExpenseTable, ExpenseForm, ExpenseCard
              └── NotFound.jsx
services/expenseService.js  → calls services/api.js (Axios instance)
hooks/useExpenses.js        → wraps expenseService for components
context/AppContext.jsx      → shared app-level state
```

---

# 5. Folder Structure

The V1 codebase follows the structure :

```text
pennypilot/
├── README.md
├── .gitignore
├── docs/
│   ├── PRODUCT_ROADMAP.md
│   └── SRS.md
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .env / .env.example
│   └── src/
│       ├── main/java/com/pennypilot/backend/
│       │   ├── PennyPilotApplication.java
│       │   ├── config/OpenApiConfig.java
│       │   ├── controller/ExpenseController.java
│       │   ├── dto/request/{CreateExpenseRequest, UpdateExpenseRequest}.java
│       │   ├── dto/response/ExpenseResponse.java
│       │   ├── entity/Expense.java
│       │   ├── enums/ExpenseCategory.java
│       │   ├── exception/{GlobalExceptionHandler, ResourceNotFoundException, ErrorResponse}.java
│       │   ├── mapper/ExpenseMapper.java
│       │   ├── repository/ExpenseRepository.java
│       │   └── service/ExpenseService.java
│       ├── main/resources/application.properties
│       └── test/java/.../{controller, service, repository}
├── frontend/
│   ├── package.json / vite.config.js / index.html
│   ├── Dockerfile
│   └── src/
│       ├── components/common/{Button, Card, Modal, Loader, ErrorMessage}
│       ├── components/expense/{ExpenseForm, ExpenseTable, ExpenseCard}
│       ├── pages/{Dashboard, Expenses, NotFound}.jsx
│       ├── layouts/MainLayout.jsx
│       ├── services/{api.js, expenseService.js}
│       ├── hooks/useExpenses.js
│       ├── context/AppContext.jsx
│       ├── utils/{formatCurrency.js, formatDate.js}
│       ├── constants/expenseConstants.js
│       ├── styles/{index.css, variables.css, components.css}
│       ├── App.jsx
│       └── main.jsx
├── database/
│   ├── README.md
│   └── migrations/V1__initial_schema.sql
├── postman/
│   ├── PennyPilot.postman_collection.json
│   └── PennyPilot.postman_environment.json
└── .github/workflows/ci.yml
```

> **Note:** `Button's` in the originally supplied structure appears to be a typo/placeholder. This should be `Button.jsx` under `components/common/`.

---

# 6. Functional Requirements

## FR-1: Create Expense
The system shall allow a user to create an expense with: title, amount, category, expense date, and an optional description.

**Validation:**
- `title`: required, 1–120 characters
- `amount`: required, positive decimal, > 0
- `category`: required, must be one of the fixed enum values
- `expenseDate`: required, must not be a future date
- `description`: optional, max 500 characters

## FR-2: View All Expenses
The system shall allow a user to retrieve a list of all expenses, optionally filtered by category and/or date.

## FR-3: View Expense by ID
The system shall allow a user to retrieve a single expense by its unique identifier. If not found, the system returns a `404 Not Found`.

## FR-4: Update Expense
The system shall allow a user to update any editable field of an existing expense. Non-existent IDs return `404 Not Found`.

## FR-5: Delete Expense
The system shall allow a user to delete an expense by ID. Non-existent IDs return `404 Not Found`.

## FR-6: Category Management
The system shall support the following fixed categories in V1:
`FOOD`, `TRANSPORT`, `SHOPPING`, `BILLS`, `HEALTH`, `ENTERTAINMENT`, `OTHER`

## FR-7: Filtering
The system shall allow filtering expenses by:
- Category (exact match)
- Date or date range

## FR-8: Summary
The system shall provide:
- Total expense amount (sum of all matching expenses)
- Count of expenses (matching current filter, if any)

## FR-9: Frontend Dashboard
The system shall present a dashboard showing the expense summary (total spent, number of expenses) and quick access to expense management.

## FR-10: Frontend Expense Management
The system shall allow the user to add, view, edit, and delete expenses through forms and a table/list view, with basic client-side validation and loading/error states.

---

# 7. Data Model / Database Schema

## 7.1 Entity: `expenses`

| Column | Type | Constraints |
|---|---|---|
| `id` | `BIGSERIAL` / `UUID` | Primary Key |
| `title` | `VARCHAR(120)` | NOT NULL |
| `amount` | `NUMERIC(12,2)` | NOT NULL, CHECK (`amount > 0`) |
| `category` | `VARCHAR(30)` | NOT NULL, CHECK (category IN fixed list) |
| `expense_date` | `DATE` | NOT NULL |
| `description` | `VARCHAR(500)` | NULLABLE |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | NOT NULL, default `now()` |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | NOT NULL, default `now()`, updated on change |

## 7.2 SQL Migration — `V1__initial_schema.sql`

```sql
CREATE TABLE IF NOT EXISTS expenses (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(120)     NOT NULL,
    amount          NUMERIC(12,2)    NOT NULL CHECK (amount > 0),
    category        VARCHAR(30)      NOT NULL CHECK (
                        category IN (
                            'FOOD', 'TRANSPORT', 'SHOPPING',
                            'BILLS', 'HEALTH', 'ENTERTAINMENT', 'OTHER'
                        )
                    ),
    expense_date    DATE             NOT NULL,
    description     VARCHAR(500),
    created_at      TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses (expense_date);
```

## 7.3 Entity Relationship Diagram

```text
+----------------------------+
|          expenses          |
+----------------------------+
| PK id                      |
|    title                   |
|    amount                  |
|    category                |
|    expense_date            |
|    description             |
|    created_at              |
|    updated_at               |
+----------------------------+
```

V1 has a single entity — no relationships yet. Relationships (accounts, income, users) are introduced from V4 onward.

---

# 8. API Design

## 8.1 Base URL

```text
/api/v1/expenses
```

## 8.2 Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| POST | `/api/v1/expenses` | Create a new expense | `201 Created` |
| GET | `/api/v1/expenses` | List expenses (supports `category`, `startDate`, `endDate` query params) | `200 OK` |
| GET | `/api/v1/expenses/{id}` | Get expense by ID | `200 OK` |
| PUT | `/api/v1/expenses/{id}` | Update expense by ID | `200 OK` |
| DELETE | `/api/v1/expenses/{id}` | Delete expense by ID | `204 No Content` |
| GET | `/api/v1/expenses/summary` | Total amount & count (supports same filters as list) | `200 OK` |

## 8.3 Request DTOs

**`CreateExpenseRequest`**
```json
{
  "title": "Grocery Shopping",
  "amount": 1250.50,
  "category": "FOOD",
  "expenseDate": "2026-08-20",
  "description": "Weekly groceries"
}
```

**`UpdateExpenseRequest`**
```json
{
  "title": "Grocery Shopping - Updated",
  "amount": 1300.00,
  "category": "FOOD",
  "expenseDate": "2026-08-20",
  "description": "Weekly groceries + snacks"
}
```

## 8.4 Response DTO

**`ExpenseResponse`**
```json
{
  "id": 101,
  "title": "Grocery Shopping",
  "amount": 1250.50,
  "category": "FOOD",
  "expenseDate": "2026-08-20",
  "description": "Weekly groceries",
  "createdAt": "2026-08-20T10:15:30Z",
  "updatedAt": "2026-08-20T10:15:30Z"
}
```

## 8.5 Summary Response

```json
{
  "totalAmount": 38500.00,
  "totalCount": 27
}
```

## 8.6 Error Response Format

All errors follow a consistent shape via `ErrorResponse`:

```json
{
  "timestamp": "2026-08-21T09:12:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Expense not found with id: 999",
  "path": "/api/v1/expenses/999"
}
```

**Validation Error Example (`400 Bad Request`):**
```json
{
  "timestamp": "2026-08-21T09:12:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/expenses",
  "fieldErrors": [
    { "field": "amount", "message": "must be greater than 0" },
    { "field": "title", "message": "must not be blank" }
  ]
}
```

## 8.7 HTTP Status Code Standards

| Status | Usage |
|---|---|
| `200 OK` | Successful GET/PUT |
| `201 Created` | Successful POST |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Validation failure |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Reserved for future duplicate/conflict scenarios |
| `500 Internal Server Error` | Unhandled server error |

## 8.8 API Documentation

Swagger/OpenAPI UI shall be exposed (via `OpenApiConfig`) at:
```text
/swagger-ui.html
/v3/api-docs
```

---

# 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | List endpoint should respond within 300ms for up to 10,000 records (pre-pagination; full optimization is V2 scope) |
| Availability | Application should run reliably in a single-instance Docker deployment |
| Usability | Frontend must be responsive across desktop, tablet, and mobile viewports |
| Maintainability | Code must follow layered architecture with DTOs, mappers, and centralized exception handling |
| Portability | Backend and frontend must be fully containerized and runnable via Docker |
| Observability | Basic application logging (request/response, errors) must be enabled |
| Data Integrity | Database constraints (NOT NULL, CHECK) must enforce valid data at the DB layer, not just application layer |

---

# 10. Error Handling Standards

- All exceptions are caught by `GlobalExceptionHandler` (`@ControllerAdvice`).
- `ResourceNotFoundException` → `404 Not Found`.
- `MethodArgumentNotValidException` (bean validation failures) → `400 Bad Request` with field-level errors.
- Any unhandled exception → `500 Internal Server Error` with a generic message (no stack traces exposed to the client).
- Every error response uses the standard `ErrorResponse` shape (Section 8.6).

---

# 11. Testing Requirements

| Layer | Test Type | Location |
|---|---|---|
| Repository | Integration tests against PostgreSQL (or Testcontainers) | `ExpenseRepositoryTest.java` |
| Service | Unit tests with mocked repository (Mockito) | `ExpenseServiceTest.java` |
| Controller | Web layer tests (`@WebMvcTest` or full `@SpringBootTest`) | `ExpenseControllerTest.java` |
| API (manual/automated) | Postman collection covering all CRUD + filter + summary endpoints | `postman/PennyPilot.postman_collection.json` |

**Minimum coverage expectations for V1:**
- All CRUD paths (success + not-found cases)
- Validation failure cases
- Filtering by category and date
- Summary calculation correctness

---

# 12. CI/CD & Deployment

## 12.1 CI Pipeline (`.github/workflows/ci.yml`)

```text
Push / Pull Request
      ↓
Checkout code
      ↓
Set up JDK 17 & Node.js
      ↓
Backend: mvn build + test
      ↓
Frontend: npm install + build
      ↓
(Optional) Lint checks
      ↓
Build Docker images
      ↓
Report status on PR
```

## 12.2 Deployment

- `backend/Dockerfile` builds a runnable Spring Boot JAR image.
- `frontend/Dockerfile` builds a static asset image (served via Nginx or similar).
- Environment configuration is managed via `.env` / `.env.example` files (never committed with real secrets).
- Database migrations (`database/migrations/V1__initial_schema.sql`) are applied before application startup.

## 12.3 Production Verification Checklist

- [ ] Backend health check endpoint responds `200 OK`
- [ ] Frontend loads and successfully calls backend APIs
- [ ] Database migration applied successfully
- [ ] Swagger UI accessible
- [ ] Smoke test: create → view → update → delete an expense end-to-end

---

# 13. Assumptions & Constraints

- V1 is single-user; no authentication or authorization layer exists yet.
- All monetary values are assumed to be in a single currency (INR, based on roadmap examples) with 2 decimal precision.
- Categories are a fixed, hardcoded enum in V1 (not user-configurable).
- No file uploads, notifications, or recurring transactions in V1.

---

# 14. Out of Scope (Deferred to Future Versions)

| Feature | Deferred To |
|---|---|
| Search, advanced filtering, sorting, pagination | V2 |
| Analytics & budgeting | V3 |
| Income, accounts, payment methods | V4 |
| Authentication, multi-user, RBAC | V5 |
| Mobile application | V7 |
| Recurring transactions, file attachments, notifications | V8 |
| Performance/scalability (caching, queues) | V9 |
| Security hardening & VAPT | V10 |
| AI-powered features, RAG, agents | V11–V13 |

---

# 15. Acceptance Criteria

PennyPilot V1 is considered **release-ready** when:

1. All functional requirements (FR-1 to FR-10) are implemented and verified.
2. All API endpoints in Section 8 return correct responses and status codes.
3. Database schema matches Section 7 and migrations run cleanly on a fresh database.
4. Automated tests (repository, service, controller) pass in CI.
5. Postman collection runs successfully against a deployed instance.
6. Frontend is deployed, responsive, and fully functional against the live backend.
7. Swagger/OpenAPI documentation is accessible and accurate.
8. CI pipeline passes on the release branch and Docker images build successfully.
9. A real user can perform full CRUD + view summary on the deployed application without errors.

---

*End of PennyPilot V1 — Software Requirements Specification.*
