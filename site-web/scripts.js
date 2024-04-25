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
    const bestFilmList = data.results;
    //console.log(bestFilmList[0].url)
    return bestFilmList[1].url
}

async function getApreciateFilm(){
     // URL de la première page avec le filtre IMDb minimum
     const urlFilterBestRate = `${baseURL}/?imdb_score_min=9`;

     // Tableau pour stocker les URL des films
     let filmUrls = [];
 
     // Boucle pour parcourir les pages et récupérer les URL des films
     for (let page = 1; filmUrls.length < 6; page++) {
         const response = await fetch(`${urlFilterBestRate}&page=${page}`);
         const data = await response.json();
         const films = data.results;
 
         // Ajouter les URL des films à filmUrls
         for (const film of films) {
             filmUrls.push(film.url);
             if (filmUrls.length === 6) break; // Sortir de la boucle une fois que 6 URL sont obtenues
         }
     }
     console.log(filmUrls)
     return filmUrls;

}


function createFilmGrid() {
    const gridContainer = document.querySelector('.grid-apreciate-film');

    // Créez une boucle pour générer les div de la grille
    for (let i = 0; i < 6; i++) {
        // Créez un élément div pour chaque film
        const filmDiv = document.createElement('div');
        filmDiv.classList.add('film');

        // Créez l'élément img pour l'affiche du film
        const imgElement = document.createElement('img');
        imgElement.src = 'images/affiche_test.jpg'; // Ajoutez l'URL de l'affiche du film
        imgElement.alt = 'affiche du film';

        // Créez l'élément div pour l'overlay avec le nom du film
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('overlay');
        const h3Element = document.createElement('h3');
        h3Element.textContent = 'Nom du film'; // Ajoutez le nom du film
        overlayDiv.appendChild(h3Element);

        // Ajoutez l'élément img et l'overlay à l'élément filmDiv
        filmDiv.appendChild(imgElement);
        filmDiv.appendChild(overlayDiv);

        // Ajoutez l'élément filmDiv à la grille
        gridContainer.appendChild(filmDiv);
    }
}

// Appelez la fonction pour créer la grille de films





(async () => {
        const urlFilm = await getBestFilmUrl();
        const filmDescritpion = await getFilmDescription(urlFilm);
        const filmTitle = await getFilmtitle(urlFilm);
        const imageUrl = await getFilmPoster(urlFilm);
        const filmTitleElement = document.querySelector(".film-info h3");
        const filmDescritpionElement = document.getElementById('film-description');
        const filmImageElement = document.querySelector(".best-film img");
        filmDescritpionElement.innerText = filmDescritpion;
        filmTitleElement.innerText = filmTitle;
        filmImageElement.setAttribute("src", imageUrl)
        //console.log(imageUrl)
        //console.log(filmDescritpion);
    
})();


createFilmGrid();
