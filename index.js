const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const movies = []
const perPage = 12
let searchMovie = []
let clickPage = 1
let displayMethod = 'dataset'

const dataPanel = document.querySelector("#data-panel")
const moviesModal = document.querySelector("#movie-modal")
const searchForm = document.querySelector("#search-form")

const searchInput = document.querySelector("#search-input")
const pagination = document.querySelector('.pagination')
const listMethod = document.querySelector('.list-method')

//=============  RUN ==================
//////////////render whole panel//////////////
axios
    .get(INDEX_URL)
    .then((response) => {
        // const movies = response.data.results
        movies.push(...response.data.results)
        renderDataPanel(pageSlice(1))
        renderPangination(movies)
    })
    .catch((err) => {
        console.log(err)
    })

//////////////click Button "more", renderModal//////////////
dataPanel.addEventListener('click', renderModal)

//////////////click Button "Search", renderSearchPanel//////////////
searchForm.addEventListener('submit', submitSearchBar)

//////////////click Button "Search", renderSearchPanel//////////////
pagination.addEventListener('click', clickPagination)

//////////////change list method//////////////
listMethod.addEventListener('click', whichKindDisplayMethod)





//============= function =============
//////////////render data panel//////////////
function renderDataPanel(data) {
    let innerData = ''
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
           <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
           </div>
        </div>
        </div>
      </div>
      `
        dataPanel.innerHTML = innerData
    })
}
//////////////render list panel//////////////
function renderListPanel(data) {
    let innerData = ``
    data.forEach((item) => {
        innerData += `
      <li class="list-group-item">
      <div class="list-panel-show">
      <span>${item.title}</span>
      <span class="list-panel-btn">
      <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
      <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </span>
     </div>
      </li>
      `

    })
    dataPanel.innerHTML = innerData
}



//////////////change list method//////////////
function whichKindDisplayMethod(e) {
    ///把我點擊到的display method 都存在displayMethod裡，然後每一次要重新渲染的時候，都要判斷一次
    displayMethod = e.target.innerText
        ///???為什麼不能用includes()//////
    if (displayMethod === "view_list") {
        ////在這邊要再判斷說要丟哪裡的資料進來
        renderListPanel(pageSlice(clickPage))
    } else if (displayMethod === "dataset") {
        renderDataPanel(pageSlice(clickPage))
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
    } else if (e.target.matches('.btn-add-favorite')) {
        addNumToFavorite(e.target.dataset.id)
    }
}





//////////////Search Bar 'Submit'//////////////
function submitSearchBar(e) {
    e.preventDefault()
        ///submit之後預設的clickPage應該要為第1頁
    clickPage = 1
    let keyword = searchInput.value.toLowerCase()

    //------ 用forEach迭代 -----
    // movies.forEach(function(n) {
    //     if (n.title.toLowerCase().includes(keyword)) {
    //         searchMovie.push(n)}})

    //------ filter迭代 -----
    searchMovie = movies.filter((movies) => movies.title.toLowerCase().includes(keyword))
        //如果search裡面有東西的話，要把data放進render，render前先看現在是哪一種method
    if (searchMovie.length > 0) {
        if (displayMethod === 'view_list') {
            //只要點擊submit，render出來的就要是第一頁的資料
            renderListPanel(pageSlice(clickPage))
        } else if (displayMethod === 'dataset') {
            renderDataPanel(pageSlice(clickPage))
        }
        renderPangination(searchMovie)
    } else {
        alert(`電影清單中沒有包含${searchInput.value}的電影喔`)
    }
}



//////////////add yo favorite//////////////
function addNumToFavorite(e) {

    const favoriteListInBrowser = localStorage.getItem('favoriteList')
    let favoriteList = []
    if (favoriteListInBrowser !== null) {
        //抓回來後就要用成正確的陣列
        const movieListJSONBack = JSON.parse(favoriteListInBrowser)
        let index = []
        movieListJSONBack.forEach((item) => index.push(item.id))
        if (index.indexOf(Number(e)) < 0) {
            movieListJSONBack.push(movies[e - 1])
            localStorage.setItem('favoriteList', JSON.stringify(movieListJSONBack))
        } else {
            alert('此電影已在收藏清單中！')
        }
    } else {

        favoriteList.push(movies[e - 1])
        localStorage.setItem('favoriteList', JSON.stringify(favoriteList))
    }
}


//////////////pagination slice data show on panel//////////////
function pageSlice(page) {
    const startIndex = (page - 1) * perPage
    if (searchMovie.length > 0) {
        console.log('分頁後，有沒有盡到這裡')
        return searchMovie.slice(startIndex, startIndex + perPage)
    } else {
        console.log('分頁後，進到B區')
        return movies.slice(startIndex, startIndex + perPage)
    }

}

//////////////renderpagination//////////////
function renderPangination(e) {
    let page = Math.ceil(e.length / perPage)
    let howManyPage = ''
    for (let i = 1; i <= page; i++) {
        howManyPage += `<li class="page-item"><a class="page-link" data-page=${i} href="#">${i}</a></li>`
    }
    pagination.innerHTML = howManyPage
}

//////////////click pagination//////////////
function clickPagination(e) {
    console.log('clickPage內容', e.target.dataset.page)
    console.log('clickPage變數', clickPage)
    if (e.target.dataset.page != null) {
        clickPage = e.target.dataset.page
        console.log('page', e)
        if (displayMethod === 'view_list') {
            renderListPanel(pageSlice(clickPage))
        } else if (displayMethod === 'dataset') {
            renderDataPanel(pageSlice(clickPage))
        }
    }
}