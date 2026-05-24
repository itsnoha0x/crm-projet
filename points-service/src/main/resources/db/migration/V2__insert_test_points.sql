INSERT INTO point_balances (customer_id, current_balance, total_earned, total_redeemed) VALUES
('550e8400-e29b-41d4-a716-446655440001', 450,  450,  0),
('550e8400-e29b-41d4-a716-446655440002', 1200, 1500, 300),
('550e8400-e29b-41d4-a716-446655440003', 5500, 6000, 500),
('550e8400-e29b-41d4-a716-446655440004', 200,  200,  0),
('550e8400-e29b-41d4-a716-446655440005', 980,  1200, 220)
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO point_transactions (id, customer_id, loyalty_card_id, points, type, reference, description) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', '550e8400-e29b-41d4-a716-446655440001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 450,  'EARN',   'ACHAT-001', 'Achat en magasin'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', '550e8400-e29b-41d4-a716-446655440002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1500, 'EARN',   'ACHAT-002', 'Achat en ligne'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', '550e8400-e29b-41d4-a716-446655440002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', -300, 'REDEEM', 'REDEEM-001', 'Réduction appliquée'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', '550e8400-e29b-41d4-a716-446655440003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 6000, 'EARN',   'ACHAT-003', 'Achat VIP'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05', '550e8400-e29b-41d4-a716-446655440003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', -500, 'REDEEM', 'REDEEM-002', 'Cadeau platinum')
ON CONFLICT (id) DO NOTHING;
