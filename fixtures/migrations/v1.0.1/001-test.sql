create table if not exists test.tag (
  name            text not null check (char_length(name) < 80),
  description     text,
  created_at      timestamp default now()
);