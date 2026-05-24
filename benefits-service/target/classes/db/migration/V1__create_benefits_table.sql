CREATE TABLE IF NOT EXISTS benefits (
    id          UUID         PRIMARY KEY,
    card_type   VARCHAR(20)  NOT NULL,
    title       VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    active      BOOLEAN      NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_benefits_card_type ON benefits(card_type);
