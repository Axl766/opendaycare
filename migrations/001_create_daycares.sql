-- Spec 07 — Tabla `daycares` (entidad raíz del sistema)
CREATE TABLE daycares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daycares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daycares_select_public"
  ON daycares
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "daycares_insert_authenticated"
  ON daycares
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "daycares_update_authenticated"
  ON daycares
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "daycares_delete_authenticated"
  ON daycares
  FOR DELETE
  TO authenticated
  USING (true);
