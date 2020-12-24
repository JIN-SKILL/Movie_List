'use strict'
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

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
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
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

function removeFavorite(id) {
  if (!movies) return // 如果movie陣列沒有存值就直接return
  const movieIndex = movies.findIndex(movie => movie.id === id) //如果清單中有這筆ID 則賦值index 沒有則回index為-1
  if (movieIndex === -1) return // 判斷最愛清單如果沒有這部電影就直接return
  movies.splice(movieIndex, 1) //刪除此筆電影
  localStorage.setItem('favoriteMovies', JSON.stringify(movies)) //重寫入localStorage favoriteMovies
  renderMovieList(movies) //重新渲染頁面
}


function onPanelClicked(e) {
  let target = e.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(target.dataset.id))
  }
}

dataPanel.addEventListener('click', onPanelClicked)

renderMovieList(movies)
