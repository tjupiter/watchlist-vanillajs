const movieCardContainer = document.querySelector('.movie-section-container')
var localMovies

function getLocalMoviesData() {
    localMovies = JSON.parse(localStorage.getItem("movies"))
}

function loadLocalMovies() {
    getLocalMoviesData()
    console.log(localMovies)

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
            <section class="nothing-to-show-div">
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
            let currentMovie = moviesArray[i]
            movieCardContainer.innerHTML += `
                <article class="movie-card">
                        <div>
                            <img src="${currentMovie.Poster}" class="movie-image">
                        </div>
                        <div>
                            <div class="movie-title">
                                <h1>
                                    ${currentMovie.Title}
                                </h1>
                            </div>
                            <div class="movie-tags">
                                <span class="star-span">
                                    <i class="fa-solid fa-star"></i>
                                    ${currentMovie.imdbRating}
                                </span>
                                <span class="movie-runtime">
                                    ${currentMovie.Runtime}
                                </span>
                                <button class="remove-from-watchlist" data-imdb-id=${currentMovie.imdbID}>
                                    <i class="fa-solid fa-circle-minus"></i>
                                    Remove
                                </button>
                            </div>
                            <div class="movie-info">
                                <p>${currentMovie.Genre}</p>
                                <p>${currentMovie.Plot}</p>
                            </div>
                        </di>
                    </article>
            `
        }
    }
}

function removeMovie() {
    // 'data-movie-id' html data-attribute stored on the remove button for easier access ==> this.getAttribute
    currentImdbID = this.getAttribute("data-imdb-id")
    updatedMovies = localMovies.filter(movie => movie.imdbID != currentImdbID)
    localStorage.setItem('movies', JSON.stringify(updatedMovies))
    getLocalMoviesData()
    loadLocalMovies()
}


function clearLocalMovies() {
    localStorage.clear();
    movieCardContainer.innerHTML = `
        <section class="nothing-to-show-div">
            <h2>Your watchlist is looking a little empty...</h2>
            <a href="./index.html">
                <i class="fa-solid fa-circle-plus"></i>
                Let's add some movies
            </a>
        </section>
    `
}

loadLocalMovies();