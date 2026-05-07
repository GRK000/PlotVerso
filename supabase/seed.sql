insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
values
('00000000-0000-0000-0000-000000000001','clara@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
('00000000-0000-0000-0000-000000000002','mateo@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
on conflict (id) do nothing;

insert into public.profiles (id, display_name, birth_date, interested_in, relationship_intent, city, country, bio, onboarding_completed, visibility)
values
('00000000-0000-0000-0000-000000000001','Clara','1992-04-13','{"Mujer","Hombre","No binario"}','Citas sin presión','Madrid','España','Lee con atención y prefiere conversaciones concretas.', true, '{"age":true,"city":true,"books":true}'),
('00000000-0000-0000-0000-000000000002','Mateo','1988-11-02','{"Mujer","Hombre","No binario"}','Conversación','Barcelona','España','Interés por ensayo narrativo e historia cultural.', true, '{"age":true,"city":true,"books":true}')
on conflict (id) do nothing;

insert into public.profile_photos (user_id, url, position)
values
('00000000-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=70',0),
('00000000-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=70',0);

insert into public.reader_profiles (user_id, reading_frequency, preferred_formats, languages, favorite_genres, disliked_genres, favorite_authors, themes, tones, conversation_style, open_answers, ai_summary)
values
('00000000-0000-0000-0000-000000000001','Varias veces por semana','{"Papel","Ebook"}','{"Español","Inglés"}','{"Ficción literaria","Novela psicológica"}','{}','{}','{"introspección","memoria"}','{"Directo","Curioso"}','Concreta, con preguntas específicas.','{"tasteBook":"Nada","overratedBook":"Uno que confunda intensidad con ruido","hook":"Una voz precisa","conversationLoss":"Las respuestas automáticas"}','Perfil lector atento a estilo, conflicto y matices.'),
('00000000-0000-0000-0000-000000000002','De vez en cuando','{"Papel","Ebook"}','{"Español","Inglés"}','{"Ensayo","Historia"}','{}','{}','{"ideas","observación"}','{"Directo","Curioso"}','Analítica y calmada.','{"tasteBook":"El infinito en un junco","overratedBook":"Un ensayo sin estructura","hook":"Una idea clara","conversationLoss":"La pose intelectual"}','Perfil lector orientado a ideas y contexto.')
on conflict (user_id) do nothing;

insert into public.books (title, authors, published_year, source)
select * from (values
('Nada', '{"Carmen Laforet"}'::text[], 1945, 'seed'),
('Los detectives salvajes', '{"Roberto Bolaño"}'::text[], 1998, 'seed'),
('El infinito en un junco', '{"Irene Vallejo"}'::text[], 2019, 'seed'),
('Stoner', '{"John Williams"}'::text[], 1965, 'seed'),
('Solaris', '{"Stanisław Lem"}'::text[], 1961, 'seed'),
('Maus', '{"Art Spiegelman"}'::text[], 1980, 'seed'),
('Ficciones', '{"Jorge Luis Borges"}'::text[], 1944, 'seed'),
('Apegos feroces', '{"Vivian Gornick"}'::text[], 1987, 'seed'),
('La vegetariana', '{"Han Kang"}'::text[], 2007, 'seed'),
('Hamnet', '{"Maggie O''Farrell"}'::text[], 2020, 'seed'),
('Exhalación', '{"Ted Chiang"}'::text[], 2019, 'seed'),
('Beloved', '{"Toni Morrison"}'::text[], 1987, 'seed'),
('Piranesi', '{"Susanna Clarke"}'::text[], 2020, 'seed'),
('Nuestra parte de noche', '{"Mariana Enriquez"}'::text[], 2019, 'seed'),
('Manual para mujeres de la limpieza', '{"Lucia Berlin"}'::text[], 2015, 'seed'),
('La campana de cristal', '{"Sylvia Plath"}'::text[], 1963, 'seed'),
('Gilead', '{"Marilynne Robinson"}'::text[], 2004, 'seed'),
('Sostiene Pereira', '{"Antonio Tabucchi"}'::text[], 1994, 'seed'),
('El adversario', '{"Emmanuel Carrère"}'::text[], 2000, 'seed'),
('Tokio blues', '{"Haruki Murakami"}'::text[], 1987, 'seed'),
('La amiga estupenda', '{"Elena Ferrante"}'::text[], 2011, 'seed'),
('La carretera', '{"Cormac McCarthy"}'::text[], 2006, 'seed'),
('Ordesa', '{"Manuel Vilas"}'::text[], 2018, 'seed'),
('Las gratitudes', '{"Delphine de Vigan"}'::text[], 2019, 'seed'),
('Claus y Lucas', '{"Agota Kristof"}'::text[], 1986, 'seed'),
('El entenado', '{"Juan José Saer"}'::text[], 1983, 'seed'),
('La ciudad y sus muros inciertos', '{"Haruki Murakami"}'::text[], 2023, 'seed'),
('El cuento de la criada', '{"Margaret Atwood"}'::text[], 1985, 'seed'),
('La ridícula idea de no volver a verte', '{"Rosa Montero"}'::text[], 2013, 'seed'),
('El verano en que mi madre tuvo los ojos verdes', '{"Tatiana Tîbuleac"}'::text[], 2017, 'seed')
) as b(title, authors, published_year, source)
on conflict do nothing;
