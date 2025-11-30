  const API_KEY = '41ee980e4b5f05f6693fda00eb7c4fd4';
    const APILINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
    const PROFILE_PATH = 'https://image.tmdb.org/t/p/w185';
    const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`;

    const main = document.getElementById("section");
    const form = document.getElementById("form");
    const search = document.getElementById("query");

    const modal = document.getElementById("movieModal");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalOverview = document.getElementById("modalOverview");
    const modalRating = document.getElementById("modalRating");
    const modalTrailer = document.getElementById("modalTrailer");
    const castList = document.getElementById("castList");
    const closeModal = document.getElementById("closeModal");

    returnMovies(APILINK);

    function returnMovies(url) {
      fetch(url)
        .then(res => res.json())
        .then(function(data) {
          main.innerHTML = "";
          data.results.forEach(element => {
            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'card');

            const image = document.createElement('img');
            image.setAttribute('class', 'thumbnail');
            image.src = IMG_PATH + element.poster_path;

            const title = document.createElement('h3');
            title.innerText = element.title;

            div_card.appendChild(image);
            div_card.appendChild(title);

            div_card.addEventListener("click", () => showMovieDetails(element.id));

            main.appendChild(div_card);
          });
        });
    }

    function showMovieDetails(movieId) {
      const DETAILS_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
      const VIDEOS_URL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;
      const CREDITS_URL = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`;

      Promise.all([
        fetch(DETAILS_URL).then(res => res.json()),
        fetch(VIDEOS_URL).then(res => res.json()),
        fetch(CREDITS_URL).then(res => res.json())
      ])
      .then(([details, videos, credits]) => {
        modalImg.src = IMG_PATH + details.poster_path;
        modalTitle.innerText = details.title;
        modalRating.innerText = `⭐ Rating: ${details.vote_average.toFixed(1)} / 10`;
        modalOverview.innerText = details.overview || "No overview available.";

        // Trailer
        modalTrailer.innerHTML = "";
        const trailer = videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
          modalTrailer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`;
        } else {
          modalTrailer.innerHTML = "<p>No trailer available.</p>";
        }

        // Cast
        castList.innerHTML = "";
        credits.cast.slice(0, 8).forEach(actor => {
          const castDiv = document.createElement("div");
          castDiv.classList.add("cast-member");

          const img = document.createElement("img");
          img.src = actor.profile_path ? PROFILE_PATH + actor.profile_path : "https://via.placeholder.com/185x278?text=No+Image";

          const name = document.createElement("div");
          name.classList.add("cast-name");
          name.innerText = actor.name;

          castDiv.appendChild(img);
          castDiv.appendChild(name);
          castList.appendChild(castDiv);
        });

        modal.style.display = "flex";
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchItem = search.value;
      if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = "";
      }
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
    
    // MENU TOGGLE
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

hamburger.addEventListener("click", () => {
  sideMenu.classList.add("active");
});

closeMenu.addEventListener("click", () => {
  sideMenu.classList.remove("active");
});