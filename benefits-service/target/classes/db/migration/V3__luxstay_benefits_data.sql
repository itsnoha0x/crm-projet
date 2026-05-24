DELETE FROM benefits;

INSERT INTO benefits (id, card_type, title, description, active) VALUES
(gen_random_uuid(), 'SILVER', 'Late checkout 12h', 'Depart garanti jusqu a 12h sans surcout', true),
(gen_random_uuid(), 'SILVER', 'Points de bienvenue', '100 points offerts a l inscription', true),
(gen_random_uuid(), 'GOLD', 'Petit-dejeuner offert', 'Pour 2 personnes chaque matin du sejour', true),
(gen_random_uuid(), 'GOLD', 'Late checkout 14h', 'Depart garanti jusqu a 14h sans surcout', true),
(gen_random_uuid(), 'GOLD', 'Surclassement si disponible', 'Surclassement a l arrivee sous reserve de disponibilite', true),
(gen_random_uuid(), 'GOLD', 'Acces spa -20%', 'Reduction de 20% sur tous les soins spa', true),
(gen_random_uuid(), 'PLATINUM', 'Late checkout 16h', 'Depart garanti jusqu a 16h sans surcout', true),
(gen_random_uuid(), 'PLATINUM', 'Acces lounge VIP', 'Acces illimite au lounge avec open bar et collations', true),
(gen_random_uuid(), 'PLATINUM', 'Surclassement garanti', 'Surclassement confirme des la reservation', true),
(gen_random_uuid(), 'PLATINUM', 'Bouteille de bienvenue', 'Champagne ou jus de fruits premium a l arrivee', true),
(gen_random_uuid(), 'PLATINUM', 'Transfert aeroport', 'Navette privee aeroport offerte aller-retour', true);
