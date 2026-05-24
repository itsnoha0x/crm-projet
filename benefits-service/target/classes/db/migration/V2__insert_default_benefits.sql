INSERT INTO benefits (id, card_type, title, description) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'SILVER',   'Accumulation de points',     '1 point par euro dépensé'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'SILVER',   'Livraison standard gratuite', 'Livraison gratuite dès 50€'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', 'SILVER',   'Offre anniversaire',          '100 points offerts chaque année'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', 'GOLD',     'Accumulation boostée',        '1.5 points par euro dépensé'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b05', 'GOLD',     'Livraison prioritaire',       'Livraison gratuite en 2-3 jours'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b06', 'GOLD',     'Support dédié',               'Ligne téléphonique prioritaire 7j/7'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b07', 'GOLD',     'Offre anniversaire',          '250 points offerts chaque année'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b08', 'PLATINUM', 'Accumulation maximale',       '2 points par euro dépensé'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b09', 'PLATINUM', 'Livraison express',           'Livraison gratuite en 24h'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b10', 'PLATINUM', 'Accès VIP',                   'Accès aux ventes privées exclusives'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'PLATINUM', 'Support premium',             'Conseiller personnel dédié 24h/24'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'PLATINUM', 'Bonus anniversaire',          '500 points offerts chaque année')
ON CONFLICT (id) DO NOTHING;
