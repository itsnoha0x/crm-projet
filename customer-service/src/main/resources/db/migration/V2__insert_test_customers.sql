INSERT INTO customers (id, first_name, last_name, email, phone, address, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ahmed',   'Benali',  'ahmed@test.com',   '0612345678', 'Rabat',      'ACTIVE'),
('550e8400-e29b-41d4-a716-446655440002', 'Sara',    'Idrissi', 'sara@test.com',    '0623456789', 'Casablanca', 'ACTIVE'),
('550e8400-e29b-41d4-a716-446655440003', 'Youssef', 'Alami',   'youssef@test.com', '0634567890', 'Marrakech',  'ACTIVE'),
('550e8400-e29b-41d4-a716-446655440004', 'Fatima',  'Chraibi', 'fatima@test.com',  '0645678901', 'Fès',        'ACTIVE'),
('550e8400-e29b-41d4-a716-446655440005', 'Omar',    'Tazi',    'omar@test.com',    '0656789012', 'Tanger',     'ACTIVE')
ON CONFLICT (id) DO NOTHING;
