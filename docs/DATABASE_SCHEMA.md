# PennyPilot V1 — Database Schema

**Database Engine:** PostgreSQL 15+
**Migration Tool:** Plain versioned SQL files under `database/migrations/`

---

## 1. Overview

V1 introduces a single table, `expenses`, sufficient to support full CRUD, category-based filtering, date-based filtering, and summary aggregation.

---

## 2. Table: `expenses`

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `BIGSERIAL` | No | auto-increment | Primary key |
| `title` | `VARCHAR(120)` | No | — | Short label for the expense |
| `amount` | `NUMERIC(12,2)` | No | — | Must be `> 0` |
| `category` | `VARCHAR(30)` | No | — | Restricted to fixed enum values |
| `expense_date` | `DATE` | No | — | Date the expense occurred |
| `description` | `VARCHAR(500)` | Yes | `NULL` | Optional free-text notes |
| `created_at` | `TIMESTAMPTZ` | No | `now()` | Set on insert |
| `updated_at` | `TIMESTAMPTZ` | No | `now()` | Updated on every modification |

### Constraints

- `PRIMARY KEY (id)`
- `CHECK (amount > 0)`
- `CHECK (category IN ('FOOD','TRANSPORT','SHOPPING','BILLS','HEALTH','ENTERTAINMENT','OTHER'))`

### Indexes

| Index | Column(s) | Purpose |
|---|---|---|
| `idx_expenses_category` | `category` | Speed up category filters |
| `idx_expenses_expense_date` | `expense_date` | Speed up date-range filters |

---

## 3. Migration Script — `V1__initial_schema.sql`

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

### Optional: auto-update `updated_at` trigger

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```

---

## 4. Entity Relationship Diagram (V1)

```text
+----------------------------+
|          expenses          |
+----------------------------+
| PK  id             BIGINT  |
|     title          VARCHAR |
|     amount         NUMERIC |
|     category        VARCHAR|
|     expense_date   DATE    |
|     description    VARCHAR |
|     created_at     TSTZ    |
|     updated_at     TSTZ    |
+----------------------------+
```

V1 is intentionally a single-table schema. No foreign keys or relationships exist yet.

---

## 5. Forward-Compatibility Notes (for future versions)

These are **not** implemented in V1, but the schema is designed so they can be added without breaking changes:

| Version | Planned Schema Addition |
|---|---|
| V4 | `accounts`, `payment_methods`, `income` tables; `expenses.account_id`, `expenses.payment_method_id` foreign keys |
| V5 | `users` table; `expenses.user_id` foreign key; auth-related tables |
| V8 | `recurring_rules`, `attachments`, `notifications` tables |
| V12 | Vector embedding columns / vector store integration for RAG |

---

## 6. Sample Data (for local development/testing)

```sql
INSERT INTO expenses (title, amount, category, expense_date, description) VALUES
('Grocery Shopping', 1250.50, 'FOOD', '2026-08-01', 'Weekly groceries'),
('Uber Ride', 320.00, 'TRANSPORT', '2026-08-03', 'Airport drop'),
('Electricity Bill', 2100.00, 'BILLS', '2026-08-05', 'Monthly bill'),
('Movie Night', 600.00, 'ENTERTAINMENT', '2026-08-10', NULL),
('Pharmacy', 450.75, 'HEALTH', '2026-08-12', 'Medicines');
```
