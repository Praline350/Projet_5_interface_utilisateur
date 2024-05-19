const baseURL = 'http://127.0.0.1:8000/api/v1/titles';
const genresUrl = 'http://127.0.0.1:8000/api/v1/genres';



async function getfilmUrl(){
    const response = await fetch(baseURL);
    const data = await response.json();
    const filmUrl = data.results[0].url;
    return filmUrl
}

async function getGenres(){
    let page = 1;
    let genres = [];
    while (true){
        const response = await fetch(`${genresUrl}/?page=${page}`);
        const data = await response.json();
        if (data.results && data.results.length > 0){
            data.results.forEach(genre => {
                genres.push(genre.name);
                
            });
        }
        if (data.next){
            page++;
        }else {
            break;
        }
    }
   return genres;
}

async function getFilmDescription(filmUrl){
    const response = await fetch(filmUrl);
    const data = await response.json();
    const filmDescritpion = data.description;
    return filmDescritpion;
}

async function  getFilmInfosModal(filmUrl){
    const response = await fetch(filmUrl);
    const data = await response.json();
    const filmInfos = {
        title: data.title,
        poster: data.image_url,
        longDescription: data.long_description,
        genres: data.genres,
        year: data.year,
        rated: data.rated,
        score: data.imdb_score,
        directors: data.directors,
        actors: data.actors,
        duration: data.duration,
        country: data.countries
    };
    return filmInfos;
}



async function getFilmtitle(filmUrl){
    const response = await fetch(filmUrl);
    const data = await response.json();
    const filmTitle = data.original_title;
    return filmTitle
}

async function getFilmPoster(filmUrl){
    const response = await fetch(filmUrl);
    const data = await response.json()
    const imageUrl = data.image_url;
    return imageUrl
}

async function getBestFilmUrl(){
    // Recupère le/lesfilm à la meilleure note toute categorie
    // Return: liste
    const urlFilterBestRate = `${baseURL}/?sort_by=-imdb_score&imdb_score_min=9.5`
    const response = await fetch(urlFilterBestRate);
    const data = await response.json();
    const bestFilms = data.results;
    let bestFilmList = [];
    for (const film of bestFilms){
        bestFilmList.push(film.url);
    }
    return bestFilmList
}

async function getApreciateFilm(){
     // Récupère les films les plus aprécié suivant leurs note Imdb
     // Retourne une liste des url des films

     const urlFilterBestRate = `${baseURL}/?sort_by=-imdb_score&imdb_score_max=9.5`;
     let filmApreciateUrls = [];
     for (let page = 1; filmApreciateUrls.length < 6; page++) {
         const response = await fetch(`${urlFilterBestRate}&page=${page}`);
         const data = await response.json();
         const films = data.results;
         for (const film of films) {
             filmApreciateUrls.push(film.url);
             if (filmApreciateUrls.length === 12) break;
         }
     }
    return filmApreciateUrls;
}

async function getBestCategoryFilm(category) {
    // Recupère les meilleurs film par category
    // Args : nom de la categorie
    // Return : liste des meilleurs films

    let categoryFilmUrls = [];
    let nextPage = true;
    for (let page = 1; categoryFilmUrls.length < 10 && nextPage; page++) {
        try {
            const response = await fetch(`${category}&page=${page}`);
            const data = await response.json();
            const films = data.results;

            for (const film of films) {
                categoryFilmUrls.push(film.url);
            }
            nextPage = data.next !== null;
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des films :", error);
            break;
        }
    }

    return categoryFilmUrls;
}



async function ressourcesVerif(url){
    //Verfifie si la ressource est disponnible

    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // Renvoie true si la réponse est OK (200-299), sinon false
    } catch (error) {
        
        return false; 
    }
}


export { 
    getApreciateFilm,
    getBestCategoryFilm,
    getBestFilmUrl,
    getFilmDescription,
    getFilmPoster,
    getFilmtitle,
    getfilmUrl,
    ressourcesVerif,
    getFilmInfosModal,
    getGenres,
}