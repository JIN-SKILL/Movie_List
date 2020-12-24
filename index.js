'use strict'
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12
const movies = []
let filteredMovies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pagenator = document.querySelector('#paginator')

axios.get(INDEX_URL)
  .then(res => {
    movies.push(...res.data.results) // 等效於 res.data.results.forEach(movie => movies.push(movie))
    console.log(movies)
    renderMovieList(getMovieByPage(1))
    renderPaginator(movies.length)
  })
  .catch(err => console.log(err))

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3" >
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL}${item.image}"
            class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal"
              data-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE) //math.ceil() 無條件進位
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item" ><a class="page-link" href="javascript:;" data-page="${page}">${page}</a></li>`
  }
  pagenator.innerHTML = rawHTML
}

function getMovieByPage(page) {
  //movies ? "movies" : "filterMovies"
  const data = filteredMovies.length ? filteredMovies : movies
  // page 1 → movies 0-11
  // page 2 → movies 12-23
  // page 3 → movies 24-35
  // ...

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id)
    .then(res => {
      let movieData = res.data.results
      modalTitle.innerText = movieData.title
      modalImage.src = POSTER_URL + movieData.image
      modalDate.innerText = 'Release date: ' + movieData.release_date
      modalDescription.innerText = movieData.description
    })
    .catch(err => console.log(err))
}

function addFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


function onPanelClicked(e) {
  let target = e.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-add-favorite')) {
    addFavorite(Number(target.dataset.id))
  }
}

function onSearchFormSubmitted(e) {
  // e.preventDefault() //終止元件的預設行為

  const keyword = searchInput.value.trim().toLowerCase()
  if (e.target.matches('#search-submit-button')) {
    if (keyword.length) {
      // 同等於 filteredMovies = movies.filter(movie => { return movie.title.toLowerCase().includes(keyword) })
      filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
      if (filteredMovies.length) {
        renderMovieList(getMovieByPage(1)) //從第一頁開始顯示
        renderPaginator(filteredMovies.length)
      } else {
        alert('沒有相關電影')
        searchInput.value = ''
        renderMovieList(movies)
      }
    } else {
      alert('請輸入關鍵字')
    }
  }
}

function onPagenatorClicked(e) {
  if (e.target.tagName !== 'A') return
  const page = Number(e.target.dataset.page)
  renderMovieList(getMovieByPage(page))
}

dataPanel.addEventListener('click', onPanelClicked)
searchForm.addEventListener('click', onSearchFormSubmitted)
pagenator.addEventListener('click', onPagenatorClicked)
