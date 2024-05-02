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
        const data = await response.json()
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
    console.log(genres)
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
    //console.log(filmInfos)
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
    const urlFilterBestRate = `${baseURL}/?sort_by=-imdb_score&imdb_score_min=9.5`
    const response = await fetch(urlFilterBestRate);
    const data = await response.json();
    const bestFilms = data.results;
    let bestFilmList = [];
    for (const film of bestFilms){
        bestFilmList.push(film.url);
    }
    //console.log(bestFilmList)
    return bestFilmList
}

async function getApreciateFilm(){
     // URL de la première page avec le filtre IMDb minimum
     const urlFilterBestRate = `${baseURL}/?sort_by=-imdb_score&imdb_score_max=9.5`;

     // Tableau pour stocker les URL des films
     let filmApreciateUrls = [];
 
     // Boucle pour parcourir les pages et récupérer les URL des films
     for (let page = 1; filmApreciateUrls.length < 6; page++) {
         const response = await fetch(`${urlFilterBestRate}&page=${page}`);
         const data = await response.json();
         const films = data.results;
 
         // Ajouter les URL des films à filmUrls
         for (const film of films) {
             filmApreciateUrls.push(film.url);
             if (filmApreciateUrls.length === 12) break; // Sortir de la boucle une fois que 6 URL sont obtenues
         }
     }
    //console.log(filmApreciateUrls)
    return filmApreciateUrls;

}

async function getBestCategoryFilm(category) {
    let categoryFilmUrls = [];
    let nextPage = true;

    // Boucle pour récupérer les URLs des films jusqu'à ce que nous ayons atteint le nombre souhaité ou que nous n'ayons plus de pages à parcourir
    for (let page = 1; categoryFilmUrls.length < 10 && nextPage; page++) {
        try {
            const response = await fetch(`${category}&page=${page}`);
            const data = await response.json();
            const films = data.results;

            for (const film of films) {
                categoryFilmUrls.push(film.url);
            }

            // Vérifier s'il y a une page suivante
            nextPage = data.next !== null;
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des films :", error);
            // Si une erreur se produit, nous arrêtons la boucle
            break;
        }
    }

    return categoryFilmUrls;
}



async function ressourcesVerif(url){
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