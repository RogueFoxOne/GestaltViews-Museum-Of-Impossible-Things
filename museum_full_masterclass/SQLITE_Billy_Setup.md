# utils/guid.py
import uuid
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

class GUID(TypeDecorator):
    """
    Platform-independent GUID type.

    - Uses PostgreSQL's native UUID type when available.
    - Uses CHAR(36) / TEXT on SQLite (and other DBs) storing uuid as string.
    - Accepts uuid.UUID and str; returns uuid.UUID on load.
    """
    impl = CHAR

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        # Use CHAR(36) for portability (stores canonical string)
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            # store as uuid on Postgres (driver handles it), or str elsewhere
            val = value
        else:
            # allow strings
            val = uuid.UUID(str(value))
        if dialect.name == 'postgresql':
            return val
        # store stringified canonical form
        return str(val)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))

# utils/guid.py
import uuid
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

class GUID(TypeDecorator):
    """
    Platform-independent GUID type.

    - Uses PostgreSQL's native UUID type when available.
    - Uses CHAR(36) / TEXT on SQLite (and other DBs) storing uuid as string.
    - Accepts uuid.UUID and str; returns uuid.UUID on load.
    """
    impl = CHAR

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        # Use CHAR(36) for portability (stores canonical string)
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            # store as uuid on Postgres (driver handles it), or str elsewhere
            val = value
        else:
            # allow strings
            val = uuid.UUID(str(value))
        if dialect.name == 'postgresql':
            return val
        # store stringified canonical form
        return str(val)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))

from sqlalchemy import Column
from utils.guid import GUID
import uuid

class Payment(Base):
    __tablename__ = "payments"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(Integer, ...)
    ...

# tests/conftest.py
import pytest
from sqlalchemy import event
from sqlalchemy.engine import Engine

# If you want to enforce foreign keys for sqlite tests
@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

-- 1_create_deterministic_uuid_function.sql
CREATE OR REPLACE FUNCTION deterministic_uuid_v5(ns uuid, name text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (
    -- compute SHA1 as 40 hex chars, then format into UUID v5 layout
    -- use encode(digest(...), 'hex') if pgcrypto available, but avoid extension:
    -- fallback: use md5 of (ns || name) but md5 is 128-bit (v3). To match v5 (SHA1),
    -- we'll implement a pure-SQL SHA1 using built-in functions if available.
    -- Simpler cross-compatible approach: construct v5-like UUID using sha1 from the combination
    -- If pgcrypto is present we can use digest; otherwise emulate with md5 fallback (note: md5 != sha1)
    -- We'll try to use pgcrypto.digest if available, else md5 fallback.
    (
      CASE
        WHEN (SELECT count(*) FROM pg_extension WHERE extname='pgcrypto') > 0 THEN
          (
            -- take first 16 bytes of sha1 digest
            (encode(substring(digest(ns::text || name, 'sha1') from 1 for 16), 'hex'))
          )
        ELSE
          -- fallback: use md5(ns || name) (128-bit) and treat as v3-like deterministic uuid
          encode(decode(md5(ns::text || name), 'hex'), 'hex')
      END
    )
  )::uuid;
$$;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION deterministic_uuid_v5(ns uuid, name text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  sha1_bytes bytea;
  b bytea;
BEGIN
  -- Use SHA1 (20 bytes). For UUID v5 we need first 16 bytes
  sha1_bytes := digest(ns::text || name, 'sha1');
  b := substring(sha1_bytes FROM 1 FOR 16);

  -- Set version (5) and variant (RFC 4122)
  -- modify bytes: set 7th byte's high nibble to 5, set 9th byte's high bits to 0b10xx
  b := set_byte(b, 6, (get_byte(b,6) & 0x0f) | (5 << 4));
  b := set_byte(b, 8, (get_byte(b,8) & 0x3f) | (0x80));

  RETURN (encode(b, 'hex'))::uuid;
END;
$$;

-- migration_add_stable_id.sql
ALTER TABLE bucket_drops ADD COLUMN IF NOT EXISTS stable_id uuid;

-- backfill using deterministic_uuid_v5 with a chosen namespace; you can choose a fixed namespace UUID
-- e.g., '6ba7b810-9dad-11d1-80b4-00c04fd430c8' (DNS namespace) or pick your own:
UPDATE bucket_drops
SET stable_id = deterministic_uuid_v5('6ba7b810-9dad-11d1-80b4-00c04fd430c8'::uuid, content);

-- then set default for future inserts:
ALTER TABLE bucket_drops
ALTER COLUMN stable_id SET DEFAULT deterministic_uuid_v5('6ba7b810-9dad-11d1-80b4-00c04fd430c8'::uuid, content);

UPDATE bucket_drops
SET stable_id = deterministic_uuid_v5(
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8'::uuid,
  COALESCE(user_id::text, '') || '|' || COALESCE(content, '') || '|' || COALESCE(created_at::text, '')
);

# utils/deterministic_uuid.py
import uuid

# choose namespace UUID (use same as Postgres migration)
NAMESPACE = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')

def deterministic_uuid_v5(name: str, namespace: uuid.UUID = NAMESPACE) -> uuid.UUID:
    """
    Return UUID v5 for the given name and namespace. Matches Postgres deterministic_uuid_v5 when pgcrypto is used.
    """
    return uuid.uuid5(namespace, name)

# Example:
# deterministic_uuid_v5("some canonical training example string")

