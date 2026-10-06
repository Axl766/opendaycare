-- Spec 11 — ENUMs + tablas `parent_children` e `invitations` (RLS + políticas)
-- Idempotente por diseño.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status') THEN
    CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relationship_type') THEN
    CREATE TYPE relationship_type AS ENUM ('father', 'mother', 'guardian');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS parent_children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  relationship relationship_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (parent_id, child_id)
);

CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id),
  invited_by uuid NOT NULL REFERENCES users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  relationship relationship_type NOT NULL,
  code text NOT NULL UNIQUE,
  status invitation_status DEFAULT 'pending',
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parent_children_child_id ON parent_children (child_id);
CREATE INDEX IF NOT EXISTS idx_invitations_child_id ON invitations (child_id);
CREATE INDEX IF NOT EXISTS idx_invitations_invited_by ON invitations (invited_by);

ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- parent_children: el padre ve sus vínculos; el staff, los de su guardería (una sola política SELECT)
DROP POLICY IF EXISTS "parent_children_select" ON parent_children;
CREATE POLICY "parent_children_select"
  ON parent_children
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = parent_id
    OR EXISTS (
      SELECT 1
      FROM public.children c
      JOIN public.rooms r ON r.id = c.room_id
      WHERE c.id = child_id
        AND r.daycare_id = (SELECT u.daycare_id FROM public.users u WHERE (select auth.uid()) = u.id)
    )
  );

DROP POLICY IF EXISTS "parent_children_insert_own" ON parent_children;
CREATE POLICY "parent_children_insert_own"
  ON parent_children
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = parent_id);

DROP POLICY IF EXISTS "parent_children_update_own" ON parent_children;
CREATE POLICY "parent_children_update_own"
  ON parent_children
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = parent_id)
  WITH CHECK ((select auth.uid()) = parent_id);

DROP POLICY IF EXISTS "parent_children_delete_own" ON parent_children;
CREATE POLICY "parent_children_delete_own"
  ON parent_children
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = parent_id);

-- invitations: el staff gestiona solo las que él envió
DROP POLICY IF EXISTS "invitations_select_own" ON invitations;
CREATE POLICY "invitations_select_own"
  ON invitations
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = invited_by);

DROP POLICY IF EXISTS "invitations_insert_own" ON invitations;
CREATE POLICY "invitations_insert_own"
  ON invitations
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = invited_by);

DROP POLICY IF EXISTS "invitations_update_own" ON invitations;
CREATE POLICY "invitations_update_own"
  ON invitations
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = invited_by)
  WITH CHECK ((select auth.uid()) = invited_by);
