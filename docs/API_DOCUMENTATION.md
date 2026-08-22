# PennyPilot V1 — API Documentation

**Base URL:** `/api/v1/expenses`
**Format:** JSON
**Auth:** None (V1 is single-user, unauthenticated)

---

## 1. Create Expense

`POST /api/v1/expenses`

**Request Body**
```json
{
  "title": "Grocery Shopping",
  "amount": 1250.50,
  "category": "FOOD",
  "expenseDate": "2026-08-20",
  "description": "Weekly groceries"
}
```

**Validation Rules**

| Field | Rule |
|---|---|
| title | required, 1–120 chars |
| amount | required, > 0, up to 2 decimal places |
| category | required, one of `FOOD, TRANSPORT, SHOPPING, BILLS, HEALTH, ENTERTAINMENT, OTHER` |
| expenseDate | required, ISO date, not in the future |
| description | optional, max 500 chars |

**Success Response — `201 Created`**
```json
{
  "id": 101,
  "title": "Grocery Shopping",
  "amount": 1250.50,
  "category": "FOOD",
  "expenseDate": "2026-08-20",
  "description": "Weekly groceries",
  "createdAt": "2026-08-21T09:00:00Z",
  "updatedAt": "2026-08-21T09:00:00Z"
}
```

**Error Response — `400 Bad Request`**
```json
{
  "timestamp": "2026-08-21T09:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/expenses",
  "fieldErrors": [
    { "field": "amount", "message": "must be greater than 0" }
  ]
}
```

---

## 2. List Expenses

`GET /api/v1/expenses`

**Query Parameters (all optional)**

| Param | Type | Description |
|---|---|---|
| `category` | string | Filter by exact category |
| `startDate` | date (`YYYY-MM-DD`) | Filter expenses on/after this date |
| `endDate` | date (`YYYY-MM-DD`) | Filter expenses on/before this date |

**Example**
```text
GET /api/v1/expenses?category=FOOD&startDate=2026-08-01&endDate=2026-08-31
```

**Success Response — `200 OK`**
```json
[
  {
    "id": 101,
    "title": "Grocery Shopping",
    "amount": 1250.50,
    "category": "FOOD",
    "expenseDate": "2026-08-20",
    "description": "Weekly groceries",
    "createdAt": "2026-08-21T09:00:00Z",
    "updatedAt": "2026-08-21T09:00:00Z"
  }
]
```

---

## 3. Get Expense by ID

`GET /api/v1/expenses/{id}`

**Success Response — `200 OK`** — same shape as above (single object).

**Error Response — `404 Not Found`**
```json
{
  "timestamp": "2026-08-21T09:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Expense not found with id: 999",
  "path": "/api/v1/expenses/999"
}
```

---

## 4. Update Expense

`PUT /api/v1/expenses/{id}`

**Request Body** — same shape as `CreateExpenseRequest`.

**Success Response — `200 OK`** — updated `ExpenseResponse`.

**Error Response** — `404 Not Found` (invalid id) or `400 Bad Request` (invalid data).

---

## 5. Delete Expense

`DELETE /api/v1/expenses/{id}`

**Success Response — `204 No Content`** (empty body)

**Error Response — `404 Not Found`** if the id does not exist.

---

## 6. Expense Summary

`GET /api/v1/expenses/summary`

Supports the same optional query parameters as the list endpoint (`category`, `startDate`, `endDate`).

**Success Response — `200 OK`**
```json
{
  "totalAmount": 38500.00,
  "totalCount": 27
}
```

---

## 7. Common Error Shape

Every non-2xx response uses this shape:

```json
{
  "timestamp": "ISO-8601 datetime",
  "status": 404,
  "error": "Not Found",
  "message": "Human-readable message",
  "path": "/api/v1/expenses/{id}",
  "fieldErrors": []
}
```

`fieldErrors` is only populated for validation errors (`400`).

---

## 8. Status Code Reference

| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful GET / PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failure |
| 404 | Not Found | Resource does not exist |
| 500 | Internal Server Error | Unhandled exception |

---

## 9. Interactive Documentation

Once the backend is running, live Swagger/OpenAPI docs are available at:

```text
http://localhost:8080/swagger-ui.html
http://localhost:8080/v3/api-docs
```

A ready-to-import Postman collection is also provided at:
```text
postman/PennyPilot.postman_collection.json
postman/PennyPilot.postman_environment.json
```
