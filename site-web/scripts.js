// URL de base de l'API
const baseURL = 'http://127.0.0.1:8000/api/v1/titles';

async function getUrlFilm(){
    const response = await fetch(baseURL);
    const data = await response.json();
    const urlFilm = data.results[0].url;
    return urlFilm
}

async function getFilmDescription(urlFilm){
    const response = await fetch(urlFilm);
    const data = await response.json();
    const filmDescritpion = data.long_description;
    return filmDescritpion;
}

async function getFilmtitle(urlFilm){
    const response = await fetch(urlFilm);
    const data = await response.json();
    const filmTitle = data.title;
    return filmTitle
}

async function getFilmPoster(urlFilm){
    const response = await fetch(urlFilm);
    const data = await response.json()
    const imageUrl = data.image_url;
    return imageUrl
}

async function getBestFilmUrl(){
    const urlFilterBestRate = `${baseURL}/?imdb_score_min=9.5`
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
     const urlFilterBestRate = `${baseURL}/?imdb_score_min=9`;

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
             if (filmApreciateUrls.length === 6) break; // Sortir de la boucle une fois que 6 URL sont obtenues
         }
     }
     //console.log(filmApreciateUrls)
     return filmApreciateUrls;

}

const category1 = `${baseURL}/?genre=action&imdb_score_min=8`

async function getBestCategoryFilm(category){
    const urlCategoryFilm = category;
    let categoryFilmUrls = [];
    for (let page = 1; categoryFilmUrls.length < 6; page++){
        const response = await fetch(`${category}&page=${page}`);
        const data = await response.json();
        const films = data.results;

        for (const film of films){
            categoryFilmUrls.push(film.url);
            if (categoryFilmUrls.length === 12) break;
        }
        
    }
    console.log(categoryFilmUrls)
    return categoryFilmUrls
}

async function ressourcesVerif(url){
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok; // Renvoie true si la réponse est OK (200-299), sinon false
    } catch (error) {
        console.error('Erreur lors de la vérification de la disponibilité de la ressource:', error);
        return false; // En cas d'erreur, considérer la ressource comme indisponible
    }
}




async function createFilmGrid(urlsFilms, gridClass) {
    const gridContainer = document.querySelector(`.${gridClass}`);
    let filmsAdded = 0;

    // Créez une boucle pour générer les div de la grille
    for (let i = 0; i < urlsFilms.length; i++) {
        if(filmsAdded >= 6){
            break;
        }
        const title = await getFilmtitle(urlsFilms[i])
        const posterUrl = await getFilmPoster(urlsFilms[i])
        if (!title || !await ressourcesVerif(posterUrl)){
            continue
        }

        // Créez un élément div pour chaque film
        const filmDiv = document.createElement('div');
        filmDiv.classList.add('grid__film');

        // Créez l'élément img pour l'affiche du film
        const imgElement = document.createElement('img');
        imgElement.classList.add("grid__film--img")
        imgElement.src = posterUrl; // Ajoutez l'URL de l'affiche du film
        imgElement.alt = 'affiche du film';
        //console.log(filmApreciateUrls[i])

        // Créez l'élément div pour l'overlay avec le nom du film
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('overlay');
        const detailBtnElement = document.createElement('button')
        detailBtnElement.classList.add('btn', 'overlay__btn')
        detailBtnElement.textContent = "Details"
        const h3Element = document.createElement('h3');
        h3Element.classList.add("overlay__h3")
        h3Element.textContent = title; // Ajoutez le nom du film
        overlayDiv.appendChild(h3Element);

        // Ajoutez l'élément img et l'overlay à l'élément filmDiv
        filmDiv.appendChild(imgElement);
        filmDiv.appendChild(overlayDiv);
        overlayDiv.appendChild(detailBtnElement)

        // Ajoutez l'élément filmDiv à la grille
        gridContainer.appendChild(filmDiv);

        filmsAdded ++;
    }
}

// Appelez la fonction pour créer la grille de films





(async () => {
        const bestFilmList = await getBestFilmUrl();
        const urlFilm = bestFilmList[1]
        const filmDescritpion = await getFilmDescription(urlFilm);
        const filmTitle = await getFilmtitle(urlFilm);
        const imageUrl = await getFilmPoster(urlFilm);
        const filmTitleElement = document.querySelector(".film-info h3");
        const filmDescritpionElement = document.getElementById('film-description');
        const filmImageElement = document.querySelector(".best-film img");
        filmDescritpionElement.innerText = filmDescritpion;
        filmTitleElement.innerText = filmTitle;
        filmImageElement.setAttribute("src", imageUrl)
        const filmApreciateUrls = await getApreciateFilm()
        const gridClassApreciateFilm = "grid-apreciate-film"
        createFilmGrid(filmApreciateUrls, gridClassApreciateFilm)
        const categoryFilmUrls = await getBestCategoryFilm(category1)
        const gridClassCategory = "grid-apreciate-film__category"
        createFilmGrid(categoryFilmUrls, gridClassCategory)
        //console.log(imageUrl)
        //console.log(filmDescritpion);
    
})();


