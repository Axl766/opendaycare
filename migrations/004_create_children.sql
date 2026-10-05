-- Spec 10 — Tabla `children`

CREATE TABLE children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id),
  full_name text NOT NULL,
  birth_date date NOT NULL,
  enrolled_at date NOT NULL,
  medical_notes text,
  allergy_tags text[] DEFAULT '{}',
  photo_consent boolean DEFAULT true,
  status child_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_children_room_id ON children (room_id);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "children_select_authenticated"
  ON children
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "children_insert_authenticated"
  ON children
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "children_update_authenticated"
  ON children
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "children_delete_authenticated"
  ON children
  FOR DELETE
  TO authenticated
  USING (true);
