const movieCardContainer = document.getElementById('movie-section-container')
var localMovies

function getLocalMoviesData() {
    localMovies = JSON.parse(localStorage.getItem("movies"))
}

function loadLocalMovies() {
    getLocalMoviesData()

    renderMovies(localMovies)

    const removeFromWatchlistButtons = document.querySelectorAll('.remove-from-watchlist')
    
    for (let i = 0; i < removeFromWatchlistButtons.length; i++) {
        button = removeFromWatchlistButtons[i]
        button.addEventListener('click', removeMovie)
    }
}

function renderMovies(moviesArray) {

    if (moviesArray === null || localMovies.length === 0) {
        movieCardContainer.innerHTML = `
            <section id="nothing-to-show-div">
                <h2>Your watchlist is looking a little empty...</h2>
                <a href="./index.html">
                <i class="fa-solid fa-circle-plus"></i>
                    Let's add some movies
                </a>
            </section>
        `
    } else {
        movieCardContainer.innerHTML = ''
        for (let i = 0; i < moviesArray.length; i++) {
            movieCardContainer.innerHTML += `
                <article class="movie-card">
                        <div>
                            <img src="${moviesArray[i].Poster}" class="movie-image">
                        </div>
                        <div>
                            <div class="movie-title">
                                <h1>
                                    ${moviesArray[i].Title}
                                </h1>
                            </div>
                            <div class="movie-tags">
                                <span class="star-span">
                                    <i class="fa-solid fa-star"></i>
                                    ${moviesArray[i].imdbRating}
                                </span>
                                <span class="movie-runtime">
                                    ${moviesArray[i].Runtime}
                                </span>
                                <button class="remove-from-watchlist">
                                    <i class="fa-solid fa-circle-minus"></i>
                                    Remove
                                </button>
                            </div>
                            <div class="movie-info">
                                <p>${moviesArray[i].Genre}</p>
                                <p>${moviesArray[i].Plot}</p>
                            </div>
                        </di>
                    </article>
            `
        }
    }
}

function removeMovie() {
    const parentElement = this.parentElement.previousElementSibling
    const thisMovieTitle = parentElement.firstElementChild.innerHTML.trim()

    updatedMovies = localMovies.filter(movie => movie.Title != thisMovieTitle)
    localStorage.setItem('movies', JSON.stringify(updatedMovies))
    getLocalMoviesData()

    loadLocalMovies()
}


function clearLocalMovies() {
    localStorage.clear();
    movieCardContainer.innerHTML = `
        <section id="nothing-to-show-div">
            <h2>Your watchlist is looking a little empty...</h2>
            <a href="./index.html">
                <i class="fa-solid fa-circle-plus"></i>
                Let's add some movies
            </a>
        </section>
    `
}

loadLocalMovies();