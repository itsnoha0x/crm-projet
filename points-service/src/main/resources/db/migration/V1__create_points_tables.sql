CREATE TABLE IF NOT EXISTS point_balances (
    customer_id     VARCHAR(255) PRIMARY KEY,
    current_balance INT       NOT NULL DEFAULT 0,
    total_earned    INT       NOT NULL DEFAULT 0,
    total_redeemed  INT       NOT NULL DEFAULT 0,
    last_updated    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS point_transactions (
    id              UUID         PRIMARY KEY,
    customer_id     VARCHAR(255) NOT NULL,
    loyalty_card_id VARCHAR(255),
    points          INT          NOT NULL,
    type            VARCHAR(20)  NOT NULL,
    reference       VARCHAR(100),
    description     VARCHAR(255),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON point_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON point_transactions(created_at DESC);
