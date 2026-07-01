// ===== 설정 =====
const API_KEY = "0c7746c159a94154d5e1a7b1832a55b4";
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`;
const IMG_BASE = "https://image.tmdb.org/t/p/w500"; // 포스터용
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original"; // 배너용

// ===== DOM =====
const grid = document.getElementById("movie-grid");
const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");
const heroOverview = document.getElementById("hero-overview");

// ===== 영화 데이터 가져오기 =====
async function fetchMovies() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`요청 실패 (${res.status})`);

    const data = await res.json();
    const movies = data.results;

    if (!movies || movies.length === 0) {
      grid.innerHTML = `<p class="error">상영 중인 영화가 없습니다.</p>`;
      return;
    }

    renderHero(movies[0]); // 첫 번째 영화를 배너로
    renderMovies(movies);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="error">영화를 불러오지 못했습니다: ${err.message}</p>`;
  }
}

// ===== 히어로 배너 렌더링 =====
function renderHero(movie) {
  if (movie.backdrop_path) {
    hero.style.backgroundImage = `url(${BACKDROP_BASE}${movie.backdrop_path})`;
  }
  heroTitle.textContent = movie.title;
  heroOverview.textContent = movie.overview || "";
}

// ===== 영화 카드 목록 렌더링 =====
function renderMovies(movies) {
  grid.innerHTML = ""; // 로딩 문구 제거

  movies.forEach((movie) => {
    const poster = movie.poster_path
      ? `${IMG_BASE}${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    const rating = movie.vote_average
      ? `★ ${movie.vote_average.toFixed(1)}`
      : "";

    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${poster}" alt="${movie.title}" loading="lazy" />
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-rating">${rating}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== 실행 =====
fetchMovies();
