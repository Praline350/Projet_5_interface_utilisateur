import {
    getApreciateFilm,
    getBestCategoryFilm,
    getBestFilmUrl,
    getFilmDescription,
    getFilmPoster,
    getFilmtitle,
    getfilmUrl,
    ressourcesVerif,
    getFilmInfosModal,
    getGenres
} from './apiFecther.js'


const baseURL = 'http://127.0.0.1:8000/api/v1/titles';
const genresUrl = 'http://127.0.0.1:8000/api/v1/genres';
const categoryAction = `${baseURL}/?genre=action&imdb_score_min=8.5`;
const categoryComedy = `${baseURL}/?genre=comedy&imdb_score_min=8.5`;
const gridClassCategoryAction = "grid-apreciate-film__category";
const gridClassCategoryComedy = "grid-apreciate-film__category2";
const gridClassCategoryChoice = "grid-choice-category"




async function createDetailsBtn(filmUrl){
    const detailBtnElement = document.createElement('button');
    detailBtnElement.classList.add('btn', 'overlay__btn', 'modal-trigger');
    detailBtnElement.textContent = "Details";
    //console.log(filmUrl)
    detailBtnElement.dataset.filmUrl = filmUrl
    //console.log(detailBtnElement)
    detailBtnElement.addEventListener('click',async (event) =>{
        const clickedFilmUrl = event.target.dataset.filmUrl;
        await createModal(clickedFilmUrl)
        

    }); // Ajout de l'écouteur d'événements
    return detailBtnElement;
}

async function createModal(filmUrl){
    console.log(filmUrl)
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    modalTriggers.forEach(trigger => 
    trigger.addEventListener("click", toggleModal)),
    createModalInfos(filmUrl)
} 

async function createModalInfos(filmUrl){
    const filmInfos = await getFilmInfosModal(filmUrl);
    const titleElement = document.querySelector(".modal-title");
    titleElement.textContent = filmInfos.title;
    const longDescriptionElement = document.querySelector('.modal-long-description');
    longDescriptionElement.textContent = filmInfos.longDescription;
    const genreElement = document.querySelector('.modal-genres');
    genreElement.textContent = filmInfos.genres.join(", ");
    const posterElement = document.querySelector('.modal-img');
    posterElement.src = filmInfos.poster
    const yearElement  = document.querySelector('.modal-year')
    yearElement.textContent = filmInfos.year
    const scoreElement = document.querySelector(".modal-score")
    scoreElement.textContent = `Score Imdb : ${filmInfos.score}`;
    const ratedElement = document.querySelector('.modal-rated')
    ratedElement.textContent = filmInfos.rated
    const directorsElement = document.querySelector('.modal-directors')
    directorsElement.textContent = `Réalisé par : \n${filmInfos.directors}`;
    const actorsElement = document.querySelector('.modal-actors');
    actorsElement.textContent = `Avec : \n${filmInfos.actors}`;
    const durationElement = document.querySelector('.modal-duration')
    durationElement.textContent = `${filmInfos.duration} Minutes`
    const countryElement = document.querySelector('.modal-country')
    countryElement.textContent = filmInfos.country
    
}

function toggleModal(){
    const modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.toggle('active')
}

async function createFilmGrid(urlsFilms, gridClass) {
    const gridContainer = document.querySelector(`.${gridClass}`);
    let filmsAdded = 0;
    for (let i = 0; i < urlsFilms.length; i++) {
        if(filmsAdded >= 6){
            break;
        }
        const title = await getFilmtitle(urlsFilms[i])
        const posterUrl = await getFilmPoster(urlsFilms[i])
        if (!title || !await ressourcesVerif(posterUrl)){
            continue
        }
        const filmDiv = document.createElement('div');
        filmDiv.classList.add('grid__film');
        const imgElement = document.createElement('img');
        imgElement.classList.add("grid__film--img")
        imgElement.src = posterUrl; 
        imgElement.alt = 'affiche du film';
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('overlay');
        const detailBtnElement = await createDetailsBtn(urlsFilms[i]);
        const h3Element = document.createElement('h3');
        h3Element.classList.add("overlay__h3")
        h3Element.textContent = title;

        overlayDiv.appendChild(h3Element);
        filmDiv.appendChild(imgElement);
        filmDiv.appendChild(overlayDiv);
        overlayDiv.appendChild(detailBtnElement)
        gridContainer.appendChild(filmDiv);

        filmsAdded ++;
    }
}

async function createChoiceGenres(){
    const genres = await getGenres();
    const selectElement = document.getElementById('genre-select');
    for (let i = 0; i < genres.length; i++){
        const optionElement = document.createElement('option')
        optionElement.textContent = genres[i]
        selectElement.appendChild(optionElement)
    };
    selectElement.addEventListener('change',async(event)=>{
        const genreName = event.target.value;
        const categoryFilmUrls = await getBestCategoryFilm(`${baseURL}/?genre=${genreName}&imdb_score_min=8.5`)
        const gridContainer = document.querySelector(`.${gridClassCategoryChoice}`);
        gridContainer.innerHTML = '';
        createFilmGrid(categoryFilmUrls, gridClassCategoryChoice)
    });
}


async function displayBestFilm(filmUrl){
    const filmDescritpion = await getFilmDescription(filmUrl);
    const filmTitle = await getFilmtitle(filmUrl);
    const imageUrl = await getFilmPoster(filmUrl);
    const filmTitleElement = document.querySelector(".film-info h3");
    const filmDescritpionElement = document.getElementById('film-description');
    const filmImageElement = document.querySelector(".best-film img");
    filmDescritpionElement.innerText = filmDescritpion;
    filmTitleElement.innerText = filmTitle;
    filmImageElement.setAttribute("src", imageUrl)

    const detailBtnElement = document.createElement('button')
    detailBtnElement.classList.add('btn', 'film-info__btn', 'modal-trigger')
    detailBtnElement.textContent = "Details"
    detailBtnElement.dataset.filmUrl = filmUrl;
    detailBtnElement.addEventListener('click', async (event) => {
        const clickedFilmUrl = event.target.dataset.filmUrl;
        await createModal(clickedFilmUrl);
    });
    
    filmDescritpionElement.appendChild(detailBtnElement);
}


async function rotateBestFilm(){
    const bestFilmList = await  getBestFilmUrl();
    const filmCount = Math.min(bestFilmList.length, 4);
    let index = 0;
    async function displayNextfilm(){
        await displayBestFilm(bestFilmList[index]);
        index = (index + 1) % filmCount // Passage au film suivant, revenir au début si nécessaire
        setTimeout(displayNextfilm, 5000);
    }
    displayNextfilm();
}


async function displayApreciateFilm(){
    const filmApreciateUrls = await getApreciateFilm()
    const gridClassApreciateFilm = "grid-apreciate-film"
    createFilmGrid(filmApreciateUrls, gridClassApreciateFilm)
}

async function displayCategoryFilm(category, gridClass){
    const categoryFilmUrls = await getBestCategoryFilm(category)
    const gridClassCategory = gridClass
    createFilmGrid(categoryFilmUrls, gridClassCategory)
}


rotateBestFilm()
displayApreciateFilm()
displayCategoryFilm(categoryAction, gridClassCategoryAction)
displayCategoryFilm(categoryComedy, gridClassCategoryComedy)
createChoiceGenres()


