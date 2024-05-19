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
const categoryAction = `${baseURL}/?genre=action&sort_by=-imdb_score`;
const categoryComedy = `${baseURL}/?genre=comedy&sort_by=-imdb_score`;
const gridClassCategoryAction = "grid-apreciate-film__category";
const gridClassCategoryComedy = "grid-apreciate-film__category2";
const gridClassCategoryChoice = "grid-choice-category"


async function createPoster(filmUrl){
    // créer un element img et stock la data du film
    // Args : Url du film

    const imageElement = document.createElement('img');
    imageElement.classList.add("grid__film--img", "modal-trigger");
    imageElement.alt = 'affiche du film';
    imageElement.dataset.filmUrl = filmUrl;
    imageElement.addEventListener("click", async (event)=>{
        const clickedFilmUrl = event.target.dataset.filmUrl;
        await createModal(clickedFilmUrl);
    });
    return imageElement
}

async function createDetailsBtn(filmUrl){
    // création du boutton detail du film et stock la data du film
    // Args : Url du film

    const detailBtnElement = document.createElement('button');
    detailBtnElement.classList.add('btn', 'overlay__btn', 'modal-trigger');
    detailBtnElement.textContent = "Details";
    detailBtnElement.dataset.filmUrl = filmUrl;
    detailBtnElement.addEventListener('click',async (event) =>{
        const clickedFilmUrl = event.target.dataset.filmUrl;
        await createModal(clickedFilmUrl);
        

    }); // Ajout de l'écouteur d'événements
    return detailBtnElement;
}

async function createModal(filmUrl){
    // Affiche la modal

    const modalTriggers = document.querySelectorAll('.modal-trigger');
    modalTriggers.forEach(trigger => 
    trigger.addEventListener("click", toggleModal)),
    createModalInfos(filmUrl);
} 

async function createModalInfos(filmUrl){
    // Insère les info du film dans la modal

    const filmInfos = await getFilmInfosModal(filmUrl);
    const titleElement = document.querySelector(".modal-title");
    titleElement.textContent = filmInfos.title;
    const longDescriptionElement = document.querySelector('.modal-long-description');
    longDescriptionElement.textContent = filmInfos.longDescription;
    const genreElement = document.querySelector('.modal-genres');
    genreElement.textContent = filmInfos.genres.join(", ");
    const posterElement = document.querySelector('.modal-img');
    posterElement.src = filmInfos.poster;
    const yearElement  = document.querySelector('.modal-year');
    yearElement.textContent = filmInfos.year;
    const scoreElement = document.querySelector(".modal-score")
    scoreElement.textContent = `Score Imdb : ${filmInfos.score}`;
    const ratedElement = document.querySelector('.modal-rated');
    ratedElement.textContent = filmInfos.rated;
    const directorsElement = document.querySelector('.modal-directors');
    directorsElement.textContent = `Réalisé par : \n${filmInfos.directors}`;
    const actorsElement = document.querySelector('.modal-actors');
    actorsElement.textContent = `Avec : \n${filmInfos.actors}`;
    const durationElement = document.querySelector('.modal-duration');
    durationElement.textContent = `${filmInfos.duration} Minutes`;
    const countryElement = document.querySelector('.modal-country');
    countryElement.textContent = filmInfos.country;   
}

function toggleModal(){
    // Active la modal

    const modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.toggle('active');
}

async function createFilmGrid(urlsFilms, gridClass) {
    // Creer une grille de 6 film 
    // Args : Liste d'url de film, Class  de la grille à créer

    const gridContainer = document.querySelector(`.${gridClass}`);
    let filmsAdded = 0;
    let indexFilmGrid = 1;
    for (let i = 0; i < urlsFilms.length; i++) {
        if(filmsAdded >= 6){
            break;
        }
        const title = await getFilmtitle(urlsFilms[i]);
        const posterUrl = await getFilmPoster(urlsFilms[i]);
        if (!title || !await ressourcesVerif(posterUrl)){
            continue
        }
        const filmDiv = document.createElement('div');
        filmDiv.classList.add('grid__film');
        filmDiv.classList.add(`box${indexFilmGrid}`);
        const imgElement = await createPoster(urlsFilms[i]);
        imgElement.src = posterUrl; 
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('overlay');
        const detailBtnElement = await createDetailsBtn(urlsFilms[i]);
        const h3Element = document.createElement('h3');
        h3Element.classList.add("overlay__h3");
        h3Element.textContent = title;
        const viewMoreBtn = document.createElement('button');
        viewMoreBtn.classList.add('btn');
        viewMoreBtn.textContent = "See more";

        overlayDiv.appendChild(h3Element);
        filmDiv.appendChild(imgElement);
        filmDiv.appendChild(overlayDiv);
        overlayDiv.appendChild(detailBtnElement)
        gridContainer.appendChild(filmDiv);
        
        filmsAdded ++;
        indexFilmGrid ++;
    }
}

async function createChoiceGenres(){
    // creation de la selection de genre

    const genres = await getGenres();
    const selectElement = document.getElementById('genre-select');
    const titleGenreElement = document.getElementById('genre-selector');
    for (let i = 0; i < genres.length; i++){
        const optionElement = document.createElement('option')
        optionElement.textContent = genres[i];
        selectElement.appendChild(optionElement);
    };
    selectElement.addEventListener('change',async(event)=>{
        const genreName = event.target.value;
        const categoryFilmUrls = await getBestCategoryFilm(`${baseURL}/?genre=${genreName}&sort_by=-imdb_score`);
        const gridContainer = document.querySelector(`.${gridClassCategoryChoice}`);
        console.log(genreName);
        titleGenreElement.textContent = genreName;
        gridContainer.scrollIntoView({ behavior: 'smooth' });
        gridContainer.innerHTML = '';
        createFilmGrid(categoryFilmUrls, gridClassCategoryChoice);
    });
}


async function displayBestFilm(filmUrl){
    // Affiche les film a la meilleur note
    // Args : liste d'url des meilleurs film

    const filmDescritpion = await getFilmDescription(filmUrl);
    const filmTitle = await getFilmtitle(filmUrl);
    const imageUrl = await getFilmPoster(filmUrl);
    const filmTitleElement = document.querySelector(".film-info h3");
    const filmDescritpionElement = document.getElementById('film-description');
    const filmImageElement = document.querySelector(".best-film img");
    filmImageElement.classList.add('modal-trigger');
    filmImageElement.dataset.filmUrl = filmUrl;
    filmImageElement.addEventListener("click", async (event)=>{
        const clickedFilmUrl = event.target.dataset.filmUrl;
        await createModal(clickedFilmUrl)
    });
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
    // Creer un carousel des meilleurs film

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
    // Affiche la grille des film les + aprécié

    const filmApreciateUrls = await getApreciateFilm();
    const gridClassApreciateFilm = "grid-apreciate-film";
    createFilmGrid(filmApreciateUrls, gridClassApreciateFilm);
}

async function displayCategoryFilm(category, gridClass){
    // Affiche la grille d'une catégorie

    const categoryFilmUrls = await getBestCategoryFilm(category);
    const gridClassCategory = gridClass;
    createFilmGrid(categoryFilmUrls, gridClassCategory);
}

async function seeMorebtn() {
    // Permet le boutton pour afficher ou cacher un certain nombre de film pour
    // les medias queries

    const btnElements = document.querySelectorAll('.see-more-btn');
    btnElements.forEach((btnElement) => {
        btnElement.addEventListener('click', () => {
            const gridClassElement = btnElement.previousElementSibling;
            const gridClass = `.grid.${gridClassElement.classList[1]}`;
            const parentElement = document.querySelector(gridClass);
            const targetChild = Array.from(parentElement.children)
                .find(child => child.classList.contains('grid__film') && child.classList.contains('box3'));
            if (targetChild) {
                const targetChildIndex = Array.from(parentElement.children).indexOf(targetChild);
                for (let i = targetChildIndex + 1; i < parentElement.children.length; i++) {
                    const child = parentElement.children[i];
                    const isMediaQueryMatch = window.matchMedia("(min-width: 481px) and (max-width: 1080px)").matches;
                    const isMediaQueryChild = isMediaQueryMatch && ['box5', 'box6'].includes(child.classList[1]);
                    const isDefaultChild = !isMediaQueryMatch && ['box3', 'box4', 'box5', 'box6'].includes(child.classList[1]);
                    
                    if ((isMediaQueryChild || isDefaultChild) && child.classList.contains('grid__film')) {
                        child.style.display = child.style.display === 'flex' ? 'none' : 'flex';
                        parentElement.scrollIntoView({ behavior: 'smooth' });
                    }
                    btnElement.textContent = btnElement.textContent === 'See More' ? 'See Less' : 'See More';
                }
            }
        });
    });
}
       
            

rotateBestFilm()
displayApreciateFilm()
displayCategoryFilm(categoryAction, gridClassCategoryAction)
displayCategoryFilm(categoryComedy, gridClassCategoryComedy)
createChoiceGenres()
seeMorebtn()



