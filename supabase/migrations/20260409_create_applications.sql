-- Enum: application_status
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'bookmarked', 'applied', 'interviewing', 'accepted', 'rejected', 'ghosted'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enum: application_modality
DO $$ BEGIN
    CREATE TYPE application_modality AS ENUM (
        'remote', 'hybrid', 'on_site'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Table: applications
CREATE TABLE IF NOT EXISTS applications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    company     TEXT,
    role        TEXT,
    status      application_status NOT NULL DEFAULT 'bookmarked',
    modality    application_modality,
    location    TEXT,
    salary      TEXT,
    source      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: application_notes
CREATE TABLE IF NOT EXISTS application_notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger function: set_updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto-update updated_at on applications
DROP TRIGGER IF EXISTS trg_applications_updated_at ON applications;
CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- RLS: applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS applications_select ON applications;
CREATE POLICY applications_select ON applications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS applications_insert ON applications;
CREATE POLICY applications_insert ON applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS applications_update ON applications;
CREATE POLICY applications_update ON applications FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS applications_delete ON applications;
CREATE POLICY applications_delete ON applications FOR DELETE
    USING (auth.uid() = user_id);

-- RLS: application_notes
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS application_notes_select ON application_notes;
CREATE POLICY application_notes_select ON application_notes FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS application_notes_insert ON application_notes;
CREATE POLICY application_notes_insert ON application_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS application_notes_update ON application_notes;
CREATE POLICY application_notes_update ON application_notes FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS application_notes_delete ON application_notes;
CREATE POLICY application_notes_delete ON application_notes FOR DELETE
    USING (auth.uid() = user_id);
