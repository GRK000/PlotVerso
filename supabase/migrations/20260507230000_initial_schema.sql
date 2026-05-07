create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  birth_date date not null,
  gender text,
  interested_in text[] default '{}',
  relationship_intent text,
  city text,
  country text,
  bio text,
  onboarding_completed boolean default false,
  visibility jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  url text not null,
  position int default 0,
  created_at timestamptz default now()
);

create table public.reader_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade,
  reading_frequency text,
  preferred_formats text[] default '{}',
  languages text[] default '{}',
  favorite_genres text[] default '{}',
  disliked_genres text[] default '{}',
  favorite_authors text[] default '{}',
  themes text[] default '{}',
  tones text[] default '{}',
  conversation_style text,
  open_answers jsonb default '{}',
  ai_summary text,
  embedding jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  authors text[] default '{}',
  isbn_10 text,
  isbn_13 text,
  open_library_id text unique,
  google_books_id text unique,
  cover_url text,
  description text,
  published_year int,
  language text,
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  book_id uuid references public.books(id) on delete cascade,
  status text not null check (status in ('read','reading','pending','abandoned','favorite')),
  rating int check (rating is null or rating between 1 and 5),
  private_note text,
  public_comment text,
  is_favorite boolean default false,
  show_on_profile boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, book_id)
);

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.profiles(id) on delete cascade,
  to_user_id uuid references public.profiles(id) on delete cascade,
  value text not null check (value in ('like','pass')),
  created_at timestamptz default now(),
  unique(from_user_id, to_user_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid references public.profiles(id) on delete cascade,
  user_b_id uuid references public.profiles(id) on delete cascade,
  user_low_id uuid generated always as (least(user_a_id, user_b_id)) stored,
  user_high_id uuid generated always as (greatest(user_a_id, user_b_id)) stored,
  compatibility_score int,
  status text default 'active',
  created_at timestamptz default now(),
  unique(user_low_id, user_high_id),
  check (user_a_id <> user_b_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  was_ai_assisted boolean default false,
  created_at timestamptz default now()
);

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references public.profiles(id) on delete cascade,
  blocked_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  details text,
  status text default 'open',
  created_at timestamptz default now()
);

create table public.ai_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  event_type text not null,
  model text,
  input_hash text,
  output_json jsonb,
  created_at timestamptz default now()
);

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger reader_profiles_updated_at before update on public.reader_profiles for each row execute function public.set_updated_at();
create trigger books_updated_at before update on public.books for each row execute function public.set_updated_at();
create trigger user_books_updated_at before update on public.user_books for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.profile_photos enable row level security;
alter table public.reader_profiles enable row level security;
alter table public.books enable row level security;
alter table public.user_books enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.ai_events enable row level security;

create policy "profiles own write" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles public discoverable read" on public.profiles for select using (onboarding_completed = true);

create policy "photos visible for completed profiles" on public.profile_photos for select using (exists (select 1 from public.profiles p where p.id = user_id and p.onboarding_completed));
create policy "photos own write" on public.profile_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reader own full access" on public.reader_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reader public discover read" on public.reader_profiles for select using (exists (select 1 from public.profiles p where p.id = user_id and p.onboarding_completed));

create policy "books readable" on public.books for select using (true);
create policy "books authenticated insert" on public.books for insert with check (auth.role() = 'authenticated');
create policy "books authenticated update" on public.books for update using (auth.role() = 'authenticated');

create policy "user_books owner full" on public.user_books for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_books public limited read" on public.user_books for select using (
  show_on_profile = true and exists (select 1 from public.profiles p where p.id = user_id and p.onboarding_completed)
);

create policy "likes own read" on public.likes for select using (auth.uid() in (from_user_id, to_user_id));
create policy "likes own write" on public.likes for insert with check (auth.uid() = from_user_id);
create policy "likes own update" on public.likes for update using (auth.uid() = from_user_id);

create policy "matches participant read" on public.matches for select using (auth.uid() in (user_a_id, user_b_id));
create policy "matches participant insert" on public.matches for insert with check (auth.uid() in (user_a_id, user_b_id));

create policy "messages participant read" on public.messages for select using (
  exists (select 1 from public.matches m where m.id = match_id and auth.uid() in (m.user_a_id, m.user_b_id))
);
create policy "messages participant insert" on public.messages for insert with check (
  auth.uid() = sender_id and exists (select 1 from public.matches m where m.id = match_id and auth.uid() in (m.user_a_id, m.user_b_id))
);

create policy "blocks own read" on public.blocks for select using (auth.uid() = blocker_id);
create policy "blocks own insert" on public.blocks for insert with check (auth.uid() = blocker_id);
create policy "blocks own delete" on public.blocks for delete using (auth.uid() = blocker_id);

create policy "reports own insert" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "reports own read" on public.reports for select using (auth.uid() = reporter_id);

create policy "ai events own" on public.ai_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace view public.public_user_books as
select ub.id, ub.user_id, ub.book_id, ub.status, ub.rating, ub.public_comment, ub.is_favorite, ub.show_on_profile, ub.created_at, ub.updated_at
from public.user_books ub
where ub.show_on_profile = true;
