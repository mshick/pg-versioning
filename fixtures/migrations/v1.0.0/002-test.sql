create table if not exists test.post (
  title            text not null check (char_length(title) < 80),
  body             text,
  created_at       timestamp default now()
);