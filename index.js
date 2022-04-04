let searchBarValue, moviesFromSearch
const movieCardContainer = document.querySelector('.movie-section-container')
const figureContainer = document.querySelector('.figure-container')

if (!locallyStoredMovies) { 
    var locallyStoredMovies = [] 
} else {
    var locallyStoredMovies = JSON.parse(localStorage.getItem("movies"))
}

function getMovie(e) {
    e.preventDefault();

    searchBarValue = document.querySelector('.search-bar--input').value
    if (searchBarValue === '') {
        return
    } else {
        movieCardContainer.innerHTML = `
                <div class="loading-movies">
                    <h2>Loading movies...</h2>
                </div>
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

    document.querySelector('.search-bar--input').value = null
}

async function populateMovies(results) {
    let resultsWithExtraData = []
    for ( let i = 0; i < results.length; i++) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=324df79f&i=${results[i].imdbID}`)
        const data = await res.json()
        resultsWithExtraData.push(data)
    }
    renderMovies(resultsWithExtraData)
}

function renderMovies(movies) {
    movieCardContainer.innerHTML = ''
    const newMovies = [...movies]

    for (let i = 0; i < newMovies.length; i++) {
        let currentMovie = newMovies[i]
        movieCardContainer.innerHTML += `
            <article class="movie-card">
                    <div>
                        <a
                                    href="https://www.imdb.com/title/${currentMovie.imdbID}" 
                                    target="_blank"
                                    title="${currentMovie.Title} at IMDB.com"
                                    
                                >
                                    <img src="${currentMovie.Poster}" class="movie-image">
                                </a>

                    </div>
                    <div>
                        <div class="movie-title" data-imdb-id=${currentMovie.imdbID}>
                            <h1>
                                <a 
                                    href="https://www.imdb.com/title/${currentMovie.imdbID}" 
                                    target="_blank"
                                    title="${currentMovie.Title} at IMDB.com"
                                    class="movie-title-link"
                                >
                                    ${currentMovie.Title}
                                </a>
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
                            <button class="movie-card--add-to-watchlist">
                                <i class="fa-solid fa-circle-plus"></i> 
                                Watchlist
                            </button>
                        </div>
                        <div class="movie-info" >
                            <p class="movie-info-genre">${currentMovie.Genre}</p>
                            <p>${currentMovie.Plot}</p>
                        </div>
                    </di>
                </article>
        `
    }

//     const addToWatchlistButtons = document.querySelectorAll('.movie-card--add-to-watchlist')
    
//     for (let i = 0; i < addToWatchlistButtons.length; i++) {
//         addToWatchlistButtons[i].addEventListener('click', function() {
//             addToWatchlistButtons[i].innerHTML = 'On Watchlist'
//             // addToWatchlistButtons[i].style.cursor = 'auto'
//             const parentElement = addToWatchlistButtons[i].parentElement.previousElementSibling
//             const thisMovieTitle = parentElement.firstElementChild.innerHTML.trim()
//             movieObject = newMovies.reduce((oneMovie, currentMovie) => {
//                 if (currentMovie.Title === thisMovieTitle) {
//                     // console.log(currentMovie)
//                     return currentMovie
//                 } 

//                 return oneMovie
//             }, {})
//             locallyStoredMovies.push(movieObject)
//             localStorage.setItem('movies', JSON.stringify(locallyStoredMovies))
//         })
//     }
// }
    const movieCards = document.querySelectorAll('.movie-card')

    for (let i = 0; i < movieCards.length; i++) {
        const movieCard = movieCards[i]
        // The imdb-id property stores a unique identifier for the movie 
        // and helps to uniqely identify the movie in the "newMovies" list.
        const currentImdbID = movieCard.querySelector(".movie-title").getAttribute("data-imdb-id")
        const addToWatchListButton = movieCard.querySelector(".movie-card--add-to-watchlist")
        addToWatchListButton.addEventListener('click', function () {
            addToWatchListButton.innerHTML = 'On Watchlist'
            // find() returns the first element that is matched the criteria (imdbId) or 'undefined' if not found
            // || {} handles the case when the find() returns undefined and returns an empty object
            const movie = newMovies.find(movie => movie.imdbID == currentImdbID) || {}
            locallyStoredMovies.push(movie)
            console.log(locallyStoredMovies)
            localStorage.setItem('movies', JSON.stringify(locallyStoredMovies))
        })
    }
}

document.querySelector('.search-bar--button').addEventListener('click', getMovie)