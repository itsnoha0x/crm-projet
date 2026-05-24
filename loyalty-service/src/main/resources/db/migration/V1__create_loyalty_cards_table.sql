CREATE TABLE IF NOT EXISTS loyalty_cards (
    id           UUID        PRIMARY KEY,
    customer_id  VARCHAR(255) NOT NULL UNIQUE,
    card_number  VARCHAR(50) NOT NULL UNIQUE,
    card_type    VARCHAR(20) NOT NULL DEFAULT 'SILVER',
    status       VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    issue_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
    expiry_date  DATE        NOT NULL,
    created_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_loyalty_customer_id ON loyalty_cards(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_card_type ON loyalty_cards(card_type);
