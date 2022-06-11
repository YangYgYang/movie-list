const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const movies = JSON.parse(localStorage.getItem('favoriteList'))

const dataPanel = document.querySelector("#data-panel")
const moviesModal = document.querySelector("#movie-modal")
const searchForm = document.querySelector("#search-form")


//=============  RUN ==================
//////////////render whole panel//////////////
// axios
//     .get(INDEX_URL)
//     .then((response) => {
//         // const movies = response.data.results
//         movies.push(...response.data.results)
//     })
//     .catch((err) => {
//         console.log(err)
//     })

//////////////click Button "x", removeMovies//////////////
//////////////click Button "more", renderModal//////////////
dataPanel.addEventListener('click', renderModal)



//////////////renderFavoriteMovies//////////////
renderDataPanel(movies)




//============= function =============
//////////////render panel//////////////
function renderDataPanel(data) {
    let innerData = ''
    if (data.length === 0) { dataPanel.innerHTML = `` } else {
        data.forEach((item) => {
            innerData += `
          <div class="col-sm-3">
            <div class="mb-2">
            <div class="card">
                <img
                   src="${POSTER_URL + '/' + item.image}"
                   class="card-img-top"
                   alt="Movie Poster"
                    />
                <div class="card-body">
               <h5 class="card-title">${item.title}</h5>
                </div>
               <div class="card-footer">
               <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
               <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
               </div>
            </div>
            </div>
          </div>
          `
            dataPanel.innerHTML = innerData
        })
    }

}


//////////////render Modal//////////////
function renderModal(e) {
    // ▽也可以直接用id
    if (e.target.matches('.btn-show-movie')) {
        let pointId = e.target.dataset.id
            // click後，再抓資料回來
        axios
            .get(INDEX_URL + pointId)
            .then((response) => {
                const showMovieModalTitle = response.data.results.title
                const showMovieModalimage = response.data.results.image
                const showMovieModalDate = response.data.results.release_date
                const showMovieModaldes = response.data.results.description
                moviesModal.innerHTML = `
    <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="movie-modal-title">${showMovieModalTitle}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-8">
            <img src ="https://movie-list.alphacamp.io/posters//${showMovieModalimage}" id="movie-modal-image">
          </div>
          <div class="col-sm-4">
            <p id = "movie-modal-date">Release Date\n${showMovieModalDate}</p>
            <p id = "movie-modal-description">${showMovieModaldes}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
            })
    } else if (e.target.matches('.btn-remove-favorite')) {
        removeFavorite(e.target.dataset.id)
    }

}

//////////////remove favorite list//////////////
function removeFavorite(e) {
    const favoriteListInBrowser = localStorage.getItem('favoriteList')
    let favoriteList = JSON.parse(favoriteListInBrowser)
    favoriteList.forEach((item) => {
        if (item.id === Number(e)) {
            let index = favoriteList.indexOf(item)
            favoriteList.splice(index, 1)
        }
    })
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList))
    let newMovies = JSON.parse(localStorage.getItem('favoriteList'))
    renderDataPanel(newMovies)
}