# 🎬 MovieDB – Full-Stack Web Application

## 📌 Project Description
MovieDB is a full-stack web application that allows users to browse movies, series, and cartoons.
Users can register, log in, leave reviews, rate movies, and add them to favorites.
Admins can manage the movie catalog.

## 🌍 Live Demo
https://moviedb-b1sj.onrender.com

## 🛠 Tech Stack
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JWT
- Frontend: HTML, CSS, JavaScript
- Deployment: Render

---

## 👥 User Roles

### User
- Register / Login
- Browse movies
- Add reviews and ratings
- Add movies to favorites

### Admin
- Add new movies
- Delete movies
- Manage content

---

## 📡 API Documentation

### Auth
- POST `/auth/register` — Register user
- POST `/auth/login` — Login user

### Movies
- GET `/movies` — Get all movies
- POST `/movies` — Add movie (admin only)
- DELETE `/movies/:id` — Delete movie (admin only)

### Reviews
- POST `/reviews/:movieId` — Add review
- GET `/reviews/movie/:movieId` — Get reviews for movie

### Users
- GET `/users/profile` — Get user profile
- POST `/users/favorites/:movieId` — Toggle favorite

---

## ▶️ Run Locally

1. Clone repository
```bash
git clone https://github.com/balaussa11/moviedb.git

2. Install dependencies
npm install

3.Create .env file
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

4.Run server
npm run dev

Server runs on http://localhost:3000
