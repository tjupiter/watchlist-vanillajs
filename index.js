let searchBarValue, moviesFromSearch

const movieCardContainer = document.querySelector('.movie-section-container')
const figureContainer = document.querySelector('.figure-container')

var locallyStoredMovies = JSON.parse(localStorage.getItem("movies"))
if (locallyStoredMovies === null) {
    locallyStoredMovies = []
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
            .then(data => {
                if(data.Response === 'False') {
                    movieCardContainer.innerHTML = `
                            <div class="loading-movies">
                                <h2>No Movies Found</h2>
                            </div>
                    `
                } else {
                    return populateMovies(data.Search)
                }
                
            })
    }

    document.querySelector('.search-bar--input').value = null
}


async function populateMovies(results) {
    let resultsWithExtraData = []
    // get extended movie info based on IMDB ID
    for ( let i = 0; i < results.length; i++) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=324df79f&i=${results[i].imdbID}`)
        const data = await res.json()
        resultsWithExtraData.push(data)
    }
    // console.log(resultsWithExtraData)
    renderMovies(resultsWithExtraData)
}

function renderMovies(movies) {
    movieCardContainer.innerHTML = ''
    const newMovies = [...movies]
    
    // render individual movie cards
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
                        <div 
                            class="movie-title" 
                            data-imdb-id="${currentMovie.imdbID}"
                            data-isFav="false"
                            >
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
                            <span 
                                class="movie-button-container "
                                data-button-imdb-id="${currentMovie.imdbID}"
                            >
                                <button class="movie-card--add-to-watchlist">
                                <i class="fa-solid fa-circle-plus"></i>
                                Watchlist
                            </button>
                            </span>

                        </div>
                        <div class="movie-info" >
                            <p class="movie-info-genre">${currentMovie.Genre}</p>
                            <p>${currentMovie.Plot}</p>
                        </div>
                    </div>
                </article>
        `
        // console.log(newMovies)
        
    }

    const movieButtonContainers = document.querySelectorAll('.movie-button-container')
    
    // check if the movie is on the watchlist and change watchlist button accordingly
    // this could change to --remove from watchlist-- button

    for (buttonContainer of movieButtonContainers) {
        const currentImdbID = buttonContainer.getAttribute("data-button-imdb-id")
        for (film of locallyStoredMovies) {
            if (currentImdbID === film.imdbID) {
                buttonContainer.innerHTML = `<span class="movie-card--on-watchlist">On Watchlist</span>`
            } 
        }
    }

    const movieCards = document.querySelectorAll('.movie-card')

    // add EventListener to each button in movie cards
    for (let i = 0; i < movieCards.length; i++) {
        const movieCard = movieCards[i]

        // The imdb-id property stores a unique identifier for the movie 
        // and helps to uniqely identify the movie in the "newMovies" list.
        const currentImdbID = movieCard.querySelector(".movie-title").getAttribute("data-imdb-id")
        const addToWatchListButton = movieCard.querySelector(".movie-card--add-to-watchlist")
        const watchlistButtonContainer = movieCard.querySelector(".movie-button-container") 
        
        // Later this should bit of code should get updated with:
        // if added to movies => eventlistenere remove
        // if not added to movies => eventlistener add

        if (addToWatchListButton) {

            addToWatchListButton.addEventListener('click', function () {
                // Change watchlist button on click
                watchlistButtonContainer.innerHTML = `<span>Added</span>`
                setTimeout(function () { watchlistButtonContainer.innerHTML = `<span class="movie-card--on-watchlist">On Watchlist</span>` }, 700)
    
                // find() returns the first element that is matched the criteria (imdbId) or 'undefined' if not found
                // || {} handles the case when the find() returns undefined and returns an empty object
                // here we could add a new key-value pair to the object and this could be checked and the right add/remove button could be rendered/displayed based on this 
                const movie = {...newMovies.find(movie => movie.imdbID == currentImdbID), isFav: true} || {}
    
                // check for duplicates
                function pushToLocalMovies(array, item) {
                    if (!array.find( ({ imdbID }) => imdbID === item.imdbID)) {
                        array.push(item)
                    }
                }
    
                pushToLocalMovies(locallyStoredMovies, movie)
                
                localStorage.setItem('movies', JSON.stringify(locallyStoredMovies))
            })
        }
    }
}

document.querySelector('.search-bar--button').addEventListener('click', getMovie)