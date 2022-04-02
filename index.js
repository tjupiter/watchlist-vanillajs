let searchBarValue
let moviesFromSearch
const movieCardContainer = document.getElementById('movie-section-container')
let figureContainer = document.getElementById('figure-container')
let loadingMovies = document.getElementById('loading-movies')
if (!locallyStoredMovies) { 
    var locallyStoredMovies = [] 
} else {
    var locallyStoredMovies = JSON.parse(localStorage.getItem("movies"))
}

function getMovie(e) {
    e.preventDefault();

    searchBarValue = document.getElementById('movie-search-input').value
    if (searchBarValue === '') {
        return
    } else {
        movieCardContainer.innerHTML = `
                <div id = "loading-movies" >
                    <h2>Loading movies...</h2>
                </div >
        `
        figureContainer.style.display = 'none';
        fetch(`https://www.omdbapi.com/?apikey=8d903893&s=${searchBarValue}`)
            .then(res => res.json())
            .then(data => populateMovies(data.Search))
        // const movies = await res.json()
        // populateMovies(movies.Search)
        // console.log(movies)
        // 
    }

    document.getElementById('movie-search-input').value = null
}

async function populateMovies(results) {
    let resultsWithExtraData = []
    for ( let i = 0; i < results.length; i++) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=324df79f&i=${results[i].imdbID}`)
        // console.log(results[i].imd)
        const data = await res.json()
        resultsWithExtraData.push(data)
    }
    renderMovies(resultsWithExtraData)
}

function renderMovies(movies) {
    movieCardContainer.innerHTML = ''
    const newMovies = [...movies]

    for (let i = 0; i < newMovies.length; i++) {
        movieCardContainer.innerHTML += `
            <article class="movie-card">
                    <div>
                        <img src="${newMovies[i].Poster}" class="movie-image">
                    </div>
                    <div>
                        <div class="movie-title">
                            <h1>
                                ${newMovies[i].Title}
                            </h1>
                        </div>
                        <div class="movie-tags">
                            <span class="star-span">
                                <i class="fa-solid fa-star"></i> 
                                ${newMovies[i].imdbRating}
                            </span>
                            <span class="movie-runtime">
                                ${newMovies[i].Runtime}
                            </span>
                            <button class="movie-card--add-to-watchlist">
                                <i class="fa-solid fa-circle-plus"></i> 
                                Watchlist
                            </button>
                        </div>
                        <div class="movie-info">
                            <p class="movie-info-genre">${newMovies[i].Genre}</p>
                            <p>${newMovies[i].Plot}</p>
                        </div>
                    </di>
                </article>
        `
    }

    const addToWatchlistButtons = document.querySelectorAll('.movie-card--add-to-watchlist')
    
    for (let i = 0; i < addToWatchlistButtons.length; i++) {
        addToWatchlistButtons[i].addEventListener('click', function() {
            addToWatchlistButtons[i].innerHTML = 'On Watchlist'
            // addToWatchlistButtons[i].style.cursor = 'auto'
            const parentElement = addToWatchlistButtons[i].parentElement.previousElementSibling
            const thisMovieTitle = parentElement.firstElementChild.innerHTML.trim()
            movieObject = newMovies.reduce((oneMovie, currentMovie) => {
                if (currentMovie.Title === thisMovieTitle) {
                    // console.log(currentMovie)
                    return currentMovie
                } 

                return oneMovie
            }, {})
            locallyStoredMovies.push(movieObject)
            localStorage.setItem('movies', JSON.stringify(locallyStoredMovies))
        })
    }
}

document.getElementById('header--searchbutton').addEventListener('click', getMovie)