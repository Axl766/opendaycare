-- Spec 10 — Seed: 3 rooms para el daycare existente

INSERT INTO rooms (daycare_id, name)
SELECT id, v.name
FROM daycares
CROSS JOIN (VALUES ('Soles'), ('Lunas'), ('Estrellas')) AS v(name);
