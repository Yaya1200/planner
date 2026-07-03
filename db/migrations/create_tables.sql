-- Supabase / Postgres schema for planner
-- Run via `supabase db push` or psql connected to your project's DB

create extension if not exists pgcrypto;

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'backlog',
  priority text default 'Medium',
  due_date date,
  created_at timestamptz default now()
);
