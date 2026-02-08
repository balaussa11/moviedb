const API = "http://localhost:3000";

let userFavorites = [];

/* ================= NAV ================= */
function goHome(){ location.href="index.html" }
function goBrowse(){ location.href="browse.html" }
function goProfile(){ location.href="profile.html" }
function goAdmin(){ location.href="admin.html" }
function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.href="index.html";
}

/* ================= AUTH ================= */
async function login(){
  const res = await fetch(API+"/auth/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  if(!data.token) return showToast("Login failed", "error");

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  showToast("Logged in as " + data.role, "success");
}

async function register(){
  if(!regEmail.value || !regPassword.value){
    return showToast("Fill all fields", "error");
  }

  const res = await fetch(API+"/auth/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email: regEmail.value,
      password: regPassword.value
    })
  });

  if(res.status === 201){
    showToast("Registered successfully ✅", "success");
  } else {
    const data = await res.json();
    showToast(data.error || "Registration error", "error");
  }
}

/* ================= MOVIES ================= */
let allMoviesCache = [];

async function loadMovies(type){
  const url = type ? API+"/movies?type="+type : API+"/movies";
  const res = await fetch(url);
  const movies = await res.json();
  allMoviesCache = movies;
  renderMovies(movies);
}

function searchMovies(){
  const q = searchInput.value.toLowerCase();
  renderMovies(
    allMoviesCache.filter(m => m.name.toLowerCase().includes(q))
  );
}
/* ================= ADMIN: ADD MOVIE ================= */
async function addMovie(){
  const token = localStorage.getItem("token");
  if(!token) return showToast("Admin login required", "error");

  const name = document.getElementById("movieName")?.value.trim();
  const genre = document.getElementById("movieGenre")?.value.trim();
  const year = document.getElementById("movieYear")?.value.trim();
  const director = document.getElementById("movieDirector")?.value.trim();
  const description = document.getElementById("movieDescription")?.value.trim();
  const type = document.getElementById("movieType")?.value;
  const poster = document.getElementById("moviePoster")?.value.trim();

 

  if(!name || !description || !type){
    showToast("Fill required fields", "error");
    return;
  }

  const res = await fetch(API + "/movies",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      name,
      genre,
      year,
      director,
      description,
      type,
      poster 
    })
  });

  if(res.ok){
    showToast("Movie added 🎬", "success");
    loadMovies();
  } else {
    const data = await res.json();
    showToast(data.error || "Add movie error", "error");
  }
}


/* ================= FAVORITES ================= */
async function loadFavorites(){
  const role = localStorage.getItem("role");
  if(role === "admin"){
    userFavorites = [];
    return;
  }

  const token = localStorage.getItem("token");
  if(!token) return;

  const res = await fetch(API+"/users/favorites",{
    headers:{ Authorization:"Bearer "+token }
  });

  userFavorites = await res.json();
}

async function toggleFavorite(movieId){
  const token = localStorage.getItem("token");
  if(!token) return showToast("Login required", "error");

  const isFav = userFavorites.some(f => f._id === movieId);
  const method = isFav ? "DELETE" : "POST";

  const res = await fetch(API+"/users/favorites/"+movieId,{
    method,
    headers:{ Authorization:"Bearer "+token }
  });

  if(res.ok){
    showToast(
      isFav ? "Removed from favorites 💔" : "Added to favorites ❤️",
      "success"
    );
    await loadFavorites();
    loadMovies();
    if(location.pathname.includes("profile.html")) loadProfile();
  } else {
    showToast("Favorites error", "error");
  }
}
function showMyFavorites(){
  if (!Array.isArray(userFavorites) || userFavorites.length === 0) {
    renderMovies([]);
    showToast("No favorites yet 💔", "info");
    return;
  }

  const favoriteIds = userFavorites.map(f => f._id);

  const favMovies = allMoviesCache.filter(m =>
    favoriteIds.includes(m._id)
  );

  renderMovies(favMovies);
}

/* ================= RENDER MOVIES ================= */
function renderMovies(movies) {
  const container = document.getElementById("movies");
  if (!container) return;

  container.innerHTML = "";
  const role = localStorage.getItem("role");

  movies.forEach(m => {
    console.log("MOVIE OBJECT:", m);

    const isFav =
      role !== "admin" &&
      Array.isArray(userFavorites) &&
      userFavorites.some(f => f._id === m._id);

    
    const posterUrl =
      typeof m.poster === "string" && m.poster.trim() !== ""
        ? m.poster
        : "https://placehold.co/300x450?text=No+Poster";

    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <span class="badge ${m.type}">${m.type.toUpperCase()}</span>

      <img
        src="${posterUrl}"
        alt="${m.name}"
        class="movie-poster"
        onerror="this.src='https://placehold.co/300x450?text=No+Poster'"
      >

      <h3>${m.name}</h3>
      <p>${m.description}</p>
      <div>⭐ Rating: ${m.avgRating ?? "No ratings yet"}</div>
    `;

    if (role === "admin") {
      card.innerHTML += `
        <button onclick="deleteMovie('${m._id}')">🗑 Delete Movie</button>
      `;
    } else {
      card.innerHTML += `
        <textarea id="review-${m._id}" rows="2" placeholder="Write review..."></textarea>

        <select id="rate-${m._id}">
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="5">5 ⭐</option>
        </select>

        <div class="actions">
          <button onclick="rateMovie('${m._id}')">Send Review</button>
          <button onclick="toggleFavorite('${m._id}')">
            ${isFav ? "💔 Remove" : "❤️ Favorite"}
          </button>
        </div>
      `;
    }

    
    card.innerHTML += `
      <div id="reviews-${m._id}">
        <i>Loading reviews...</i>
      </div>
    `;

    container.appendChild(card);

    
    loadReviewsForMovie(m._id);
  });
}


/* ================= REVIEWS ================= */
async function rateMovie(movieId){
  const token = localStorage.getItem("token");
  if(!token) return showToast("Login required", "error");

  const text = document.getElementById("review-"+movieId).value.trim();
  const rating = Number(document.getElementById("rate-"+movieId).value);

  if(!text) return showToast("Please write a review ✍️", "error");

  const res = await fetch(API+"/reviews/"+movieId,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer "+token
    },
    body:JSON.stringify({ text, rating })
  });

  if(res.ok){
    showToast("Review added ⭐", "success");
    loadMovies();
  } else {
    showToast("Review error", "error");
  }
}

async function loadReviewsForMovie(movieId){
  const role = localStorage.getItem("role");

  const res = await fetch(API + "/reviews/movie/" + movieId);
  if(!res.ok) return;

  const reviews = await res.json();
  const box = document.getElementById("reviews-" + movieId);
  if(!box) return;

  if(reviews.length === 0){
    box.innerHTML = "<i>No reviews</i>";
    return;
  }

  box.innerHTML = "<b>Reviews:</b>";
  reviews.forEach(r => {
    box.innerHTML += `
      <div>
        ${r.user.email}: ${r.text} (⭐ ${r.rating})
        ${role === "admin"
          ? `<button onclick="deleteReview('${r._id}')">❌</button>`
          : ""
        }
      </div>
    `;
  });
}


/* ================= DELETE REVIEW ================= */
async function deleteReview(reviewId){
  const token = localStorage.getItem("token");
  const res = await fetch(API+"/reviews/"+reviewId,{
    method:"DELETE",
    headers:{ Authorization:"Bearer "+token }
  });

  if(res.ok){
    showToast("Review deleted 🗑", "success");
    loadMovies();
  } else {
    showToast("Delete review error", "error");
  }
}

/* ================= DELETE movie ================= */
async function deleteMovie(movieId){
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    showToast("Admins only ❌", "error");
    return;
  }

  if (!confirm("Delete this movie?")) return;

  const res = await fetch(API + "/movies/" + movieId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (res.ok) {
    showToast("Movie deleted 🎬", "success");
    loadMovies();
  } else {
    const data = await res.json();
    console.error(data);
    showToast(data.error || "Delete failed", "error");
  }
}


/* ================= PROFILE ================= */
async function loadProfile(){
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const email = payload.email;

  const role = payload.role;

if (role === "admin") {
  document.getElementById("favoritesSection").style.display = "none";
  document.getElementById("reviewsSection").style.display = "none";
}
const savedName = localStorage.getItem(`displayName_${email}`);
if (savedName) {
  displayName.value = savedName;
}

  profileEmail.innerText = email;
  profileRole.innerText = payload.role;

  displayName.value =
    localStorage.getItem(`displayName_${email}`) || "";

  initAvatar(email);

  const favRes = await fetch(API+"/users/favorites",{
    headers:{ Authorization:"Bearer "+token }
  });
  renderProfileMovies(await favRes.json());

  const revRes = await fetch(API+"/users/reviews",{
    headers:{ Authorization:"Bearer "+token }
  });
  renderReviews(await revRes.json());
}

function renderProfileMovies(movies){
  favoriteMovies.innerHTML = "";
  movies.forEach(m=>{
    favoriteMovies.innerHTML += `
      <div class="movie-card">
        <h3>${m.name}</h3>
        <p>${m.description}</p>
        <button onclick="toggleFavorite('${m._id}')">💔 Remove</button>
      </div>
    `;
  });
}

function renderReviews(reviews){
  myReviews.innerHTML = "";
  reviews.forEach(r=>{
    myReviews.innerHTML += `
      <div><b>${r.movie.name}</b>: ${r.text} (⭐ ${r.rating})</div>
    `;
  });
}


function saveProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    showToast("Not authorized", "error");
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const email = payload.email;

  const nameInput = document.getElementById("displayName");
  if (!nameInput) return;

  const name = nameInput.value.trim();
  if (!name) {
    showToast("Enter your name", "error");
    return;
  }

  localStorage.setItem(`displayName_${email}`, name);
  showToast("Profile saved ✅", "success");
}

/* ================= AVATAR ================= */
function initAvatar(email){
  const avatar = document.getElementById("avatar");
  const input = document.getElementById("avatarInput");
  if(!avatar || !input) return;

  const saved = localStorage.getItem(`avatar_${email}`);
  if(saved) avatar.src = saved;

  input.onchange = ()=>{
    const reader = new FileReader();
    reader.onload = ()=>{
      localStorage.setItem(`avatar_${email}`, reader.result);
      avatar.src = reader.result;
      showToast("Avatar updated 📸", "success");
    };
    reader.readAsDataURL(input.files[0]);
  };
}

/* ================= TOAST ================= */
function showToast(message,type="info"){
  const c = document.getElementById("toast-container");
  if(!c) return;
  const t = document.createElement("div");
  t.className=`toast ${type}`;
  t.textContent=message;
  c.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", async ()=>{
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if(location.pathname.includes("browse.html")){
    if(role !== "admin") await loadFavorites();
    loadMovies();
  }

  if(location.pathname.includes("profile.html")){
    if(!token) return location.href="index.html";
    loadProfile();
  }
});
