-- Spec 10 — ENUM `child_status` y tabla `rooms`

CREATE TYPE child_status AS ENUM ('active', 'archived');

CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daycare_id uuid NOT NULL REFERENCES daycares(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_rooms_daycare_id ON rooms (daycare_id);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rooms_select_authenticated"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "rooms_insert_authenticated"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "rooms_update_authenticated"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "rooms_delete_authenticated"
  ON rooms
  FOR DELETE
  TO authenticated
  USING (true);
