import { makeLogger } from 'ts-loader/dist/logger';

showHello('greeting', 'TypeScript');

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt!.innerText = `Hello from ${name}`;
}

interface Award {
    name: string;
    year: number;
}

interface Film {
    title: string;
    year: number;
    rating: number;
    awards: Award[];
}

interface Category {
    name: string;
    films: Film[];
}

interface FilterMatch<T> {
    type: 'FilterMatch';
    filter: T;
}

interface FilterRange<T> {
    type: 'FilterRange';
    filter: T;
    filterTo: T;
}

interface FilterSearch<T> {
    type: 'FilterSearch';
    values: T[];
}

type FilmFilters = FilterMatch<number> | FilterRange<number> | FilterSearch<string>;

class FilmList {
    constructor(public films: Film[], public filters: FilmFilters) {
    }

    applySearchValue(searchValue: string) {
        this.films = this.films.filter(film =>
            film.title.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    applyFiltersValue(filters: FilmFilters) {
        if (filters.type === 'FilterMatch' && typeof filters.filter === 'number') {
            this.films = this.films.filter(film =>
                film.year === filters.filter || film.rating === filters.filter
            );
        }
        if (filters.type === 'FilterRange' && typeof filters.filter === 'number' && typeof filters.filterTo === 'number') {
            this.films = this.films.filter(film =>
                (film.year >= filters.filter && film.year <= filters.filterTo) ||
                (film.rating >= filters.filter && film.rating <= filters.filterTo)
            );
        }
        if (filters.type === 'FilterSearch' && Array.isArray(filters.values)) {
            this.films = this.films.filter(film =>
                filters.values.includes(film.title)
            );
        }
    }
}

class CategoryList {
    constructor(public categories: Category[], public filters: FilmFilters) {
    }

    applySearchValue(searchValue: string) {
        this.categories.forEach(category => {
            category.films = category.films.filter(film => film.title.toLowerCase().includes(searchValue.toLowerCase()));
        });
    }

    applyFiltersValue(filters: FilmFilters) {
        if (filters.type === 'FilterMatch' && typeof filters.filter === 'number') {
            this.categories.forEach(category => {
                category.films = category.films.filter(film =>
                    film.year === filters.filter || film.rating === filters.filter
                );
            });
        }
        if (filters.type === 'FilterRange' && typeof filters.filter === 'number' && typeof filters.filterTo === 'number') {
            this.categories.forEach(category => {
                category.films = category.films.filter(film =>
                    (film.year >= filters.filter && film.year <= filters.filterTo) ||
                    (film.rating >= filters.filter && film.rating <= filters.filterTo)
                );
            });
        }
        if (filters.type === 'FilterSearch' && Array.isArray(filters.values)) {
            this.categories.forEach(category => {
                category.films = category.films.filter(film =>
                    filters.values.includes(film.title)
                );
            });
        }
    }
}

const realFilms: Film[] = [
    { title: 'Inception', year: 2010, rating: 8.8, awards: [] },
    { title: 'The Shawshank Redemption', year: 1994, rating: 9.3, awards: [{ name: 'Oscar', year: 1995 }] },
    { title: 'The Dark Knight', year: 2008, rating: 9.0, awards: [{ name: 'Oscar', year: 2009 }] },
    { title: 'Interstellar', year: 2014, rating: 8.6, awards: [] },
    { title: 'Forrest Gump', year: 1994, rating: 8.8, awards: [{ name: 'Oscar', year: 1995 }] }
];

const filmFilters: FilmFilters = { type: 'FilterMatch', filter: 1994 };
const filmList = new FilmList(realFilms, filmFilters);

console.log('Before filters:');
console.log(filmList.films.map(film => film.title));

filmList.applyFiltersValue(filmFilters);

console.log('After filters:');
console.log(filmList.films.map(film => film.title));

filmList.applySearchValue('Forrest Gump');

console.log('After search value:');
console.log(filmList.films.map(film => film.title));



