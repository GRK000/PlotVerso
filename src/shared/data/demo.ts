import type { Book, PublicUser, UserBook } from '@/shared/types/domain';

export const demoBooks: Book[] = [
  ['b1', 'Nada', 'Carmen Laforet', 1945],
  ['b2', 'Los detectives salvajes', 'Roberto Bolaño', 1998],
  ['b3', 'La ridícula idea de no volver a verte', 'Rosa Montero', 2013],
  ['b4', 'El infinito en un junco', 'Irene Vallejo', 2019],
  ['b5', 'La vegetariana', 'Han Kang', 2007],
  ['b6', 'Stoner', 'John Williams', 1965],
  ['b7', 'Sostiene Pereira', 'Antonio Tabucchi', 1994],
  ['b8', 'La amiga estupenda', 'Elena Ferrante', 2011],
  ['b9', 'El adversario', 'Emmanuel Carrère', 2000],
  ['b10', 'Solaris', 'Stanisław Lem', 1961],
  ['b11', 'Ficciones', 'Jorge Luis Borges', 1944],
  ['b12', 'Apegos feroces', 'Vivian Gornick', 1987],
  ['b13', 'Maus', 'Art Spiegelman', 1980],
  ['b14', 'Tokio blues', 'Haruki Murakami', 1987],
  ['b15', 'La ciudad y sus muros inciertos', 'Haruki Murakami', 2023],
  ['b16', 'Ordesa', 'Manuel Vilas', 2018],
  ['b17', 'Hamnet', 'Maggie O’Farrell', 2020],
  ['b18', 'Exhalación', 'Ted Chiang', 2019],
  ['b19', 'El cuento de la criada', 'Margaret Atwood', 1985],
  ['b20', 'Beloved', 'Toni Morrison', 1987],
  ['b21', 'La carretera', 'Cormac McCarthy', 2006],
  ['b22', 'Piranesi', 'Susanna Clarke', 2020],
  ['b23', 'Nuestra parte de noche', 'Mariana Enriquez', 2019],
  ['b24', 'Las gratitudes', 'Delphine de Vigan', 2019],
  ['b25', 'Claus y Lucas', 'Agota Kristof', 1986],
  ['b26', 'El entenado', 'Juan José Saer', 1983],
  ['b27', 'Manual para mujeres de la limpieza', 'Lucia Berlin', 2015],
  ['b28', 'La campana de cristal', 'Sylvia Plath', 1963],
  ['b29', 'Gilead', 'Marilynne Robinson', 2004],
  ['b30', 'El verano en que mi madre tuvo los ojos verdes', 'Tatiana Țîbuleac', 2017]
].map(([id, title, author, year]) => ({
  id: id as string,
  title: title as string,
  authors: [author as string],
  published_year: year as number,
  source: 'seed'
}));

const photo = (seed: number) => `https://images.unsplash.com/photo-15${seed}?auto=format&fit=crop&w=600&q=70`;

function library(user: string, ids: string[]): UserBook[] {
  return ids.map((id, index) => ({
    id: `${user}-${id}`,
    user_id: user,
    book_id: id,
    status: index % 5 === 0 ? 'reading' : index % 4 === 0 ? 'pending' : 'read',
    rating: index % 4 === 0 ? null : 4,
    private_note: null,
    public_comment: index % 2 === 0 ? 'Me interesa por su forma de mirar los vínculos.' : null,
    is_favorite: index < 2,
    show_on_profile: true,
    book: demoBooks.find((book) => book.id === id) ?? demoBooks[0]!
  }));
}

export const demoUsers: PublicUser[] = [
  ['u1', 'Clara', '1992-04-13', 'Madrid', ['Ficción literaria', 'Novela psicológica'], ['introspección', 'memoria'], ['b1', 'b3', 'b5', 'b8', 'b12', 'b28']],
  ['u2', 'Mateo', '1988-11-02', 'Barcelona', ['Ensayo', 'Historia'], ['ideas', 'observación'], ['b4', 'b7', 'b9', 'b13', 'b26', 'b29']],
  ['u3', 'Irene', '1995-06-20', 'Valencia', ['Ciencia ficción', 'Ficción literaria'], ['extrañeza', 'futuro'], ['b10', 'b11', 'b18', 'b19', 'b22', 'b2']],
  ['u4', 'Lucas', '1990-02-08', 'Sevilla', ['Terror', 'Narrativa contemporánea'], ['tensión', 'familia'], ['b21', 'b23', 'b25', 'b30', 'b6', 'b16']],
  ['u5', 'Nora', '1993-09-18', 'Bilbao', ['Memorias', 'Ensayo'], ['identidad', 'lenguaje'], ['b12', 'b16', 'b24', 'b27', 'b4', 'b3']],
  ['u6', 'Adrián', '1987-07-01', 'Zaragoza', ['Misterio', 'Novela psicológica'], ['ambigüedad', 'culpa'], ['b9', 'b11', 'b14', 'b25', 'b6', 'b1']],
  ['u7', 'Vera', '1996-12-05', 'A Coruña', ['Fantasía', 'Ciencia ficción'], ['mundos raros', 'intimidad'], ['b18', 'b19', 'b22', 'b10', 'b17', 'b20']],
  ['u8', 'Hugo', '1991-03-27', 'Granada', ['Narrativa contemporánea', 'Poesía'], ['duelo', 'detalle'], ['b17', 'b20', 'b24', 'b28', 'b30', 'b8']]
].map(([id, name, birth, city, genres, themes, ids], index) => ({
  profile: {
    id: id as string,
    display_name: name as string,
    birth_date: birth as string,
    gender: null,
    interested_in: ['Mujer', 'Hombre', 'No binario'],
    relationship_intent: index % 2 === 0 ? 'Citas sin presión' : 'Conversación',
    city: city as string,
    country: 'España',
    bio: 'Lee con atención y prefiere conversaciones concretas.',
    onboarding_completed: true,
    visibility: { age: true, city: true, books: true, reading_frequency: true }
  },
  photos: [{ id: `${id}-p1`, user_id: id as string, url: photo(index + 10), position: 0 }],
  reader: {
    id: `${id}-r`,
    user_id: id as string,
    reading_frequency: index % 2 === 0 ? 'Varias veces por semana' : 'De vez en cuando',
    preferred_formats: ['Papel', 'Ebook'],
    languages: ['Español', 'Inglés'],
    favorite_genres: genres as string[],
    disliked_genres: [],
    favorite_authors: [],
    themes: themes as string[],
    tones: ['Directo', 'Curioso'],
    conversation_style: 'Concreta, sin exceso de ironía.',
    open_answers: {
      tasteBook: 'Un libro que muestre tensión interna sin explicarlo todo.',
      overratedBook: 'Uno que confunda intensidad con ruido.',
      hook: 'Una voz precisa y una decisión difícil.',
      conversationLoss: 'Las respuestas automáticas.'
    },
    ai_summary: 'Perfil lector atento a estilo, conflicto y matices.'
  },
  library: library(id as string, ids as string[]),
  last_active_at: new Date(Date.now() - index * 86400000).toISOString()
}));

export const currentDemoUser = demoUsers[0]!;
