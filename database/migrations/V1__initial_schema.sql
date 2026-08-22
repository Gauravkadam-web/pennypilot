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
