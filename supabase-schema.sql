-- ============================================================
-- SCHEMA — Le Jeu du Sample
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- Table des questions quotidiennes
create table if not exists questions (
  id              uuid primary key default gen_random_uuid(),
  date            date not null unique,
  titre           text not null,
  artiste         text not null,
  validated_at    timestamptz,
  created_at      timestamptz default now(),
  episode_number  int,
  genre           text
);

-- Table des soumissions joueurs
create table if not exists submissions (
  id               uuid primary key default gen_random_uuid(),
  question_id      uuid not null references questions(id) on delete cascade,
  pseudo           text not null,
  titre_soumis     text not null default '',
  artiste_soumis   text not null default '',
  submitted_at     timestamptz default now(),
  -- Champs calculés à la validation
  titre_correct    boolean,
  artiste_correct  boolean,
  points           numeric(4,2),
  is_first_correct boolean default false,
  -- Contrainte : 1 seule soumission par pseudo et par question
  unique (question_id, pseudo)
);

-- Index pour les requêtes fréquentes
create index if not exists idx_submissions_question_id on submissions(question_id);
create index if not exists idx_submissions_pseudo on submissions(pseudo);
create index if not exists idx_questions_date on questions(date);

-- Table de config admin (période scoreboard, etc.)
create table if not exists config (
  key    text primary key,
  value  text not null
);

-- Valeurs par défaut
insert into config (key, value) values
  ('scoreboard_start', to_char(date_trunc('month', now()), 'YYYY-MM-DD')),
  ('scoreboard_end',   to_char((date_trunc('month', now()) + interval '1 month - 1 day'), 'YYYY-MM-DD'))
on conflict (key) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table questions  enable row level security;
alter table submissions enable row level security;
alter table config      enable row level security;

-- Questions : tout le monde peut lire (pas les bonnes réponses avant validation)
create policy "questions_read" on questions
  for select using (true);

-- Submissions : lecture publique (pour le scoreboard)
create policy "submissions_read" on submissions
  for select using (true);

-- Submissions : insert public (le joueur soumet)
create policy "submissions_insert" on submissions
  for insert with check (true);

-- Submissions : update public (modification avant validation)
create policy "submissions_update" on submissions
  for update using (titre_correct is null); -- bloqué après validation

-- Config : lecture publique
create policy "config_read" on config
  for select using (true);

-- ============================================================
-- VUE SCOREBOARD
-- Calcule le classement sur la période définie en config
-- ============================================================

create or replace view scoreboard_view as
with period as (
  select
    (select value from config where key = 'scoreboard_start')::date as start_date,
    (select value from config where key = 'scoreboard_end')::date   as end_date
),
scores as (
  select
    s.pseudo,
    coalesce(sum(s.points), 0)                          as total_points,
    count(*)                                            as nb_participations,
    count(*) filter (where s.titre_correct and s.artiste_correct) as nb_correct
  from submissions s
  join questions q on q.id = s.question_id
  cross join period p
  where q.date between p.start_date and p.end_date
    and s.points is not null
  group by s.pseudo
)
select
  pseudo,
  total_points,
  nb_participations,
  nb_correct,
  rank() over (order by total_points desc) as rank
from scores
order by total_points desc;
