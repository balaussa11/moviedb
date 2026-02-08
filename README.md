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
  <img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/2e2baff3-9e3a-4be5-b9b7-3a07d23416c6" />

- POST `/auth/login` — Login user
  <img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/f52c958d-5545-4d5b-b16d-d220d8a08d56" />


### Movies
- GET `/movies` — Get all movies
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/f55ecb7d-4a56-4516-b05a-3f4aecc0cac7" />

- POST `/movies` — Add movie (admin only)
  <img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/a6227499-bed6-4ed7-9dd7-c1a9862111e6" />

- DELETE `/movies/:id` — Delete movie (admin only)
 <img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/d3392372-e7fb-470b-961e-8951c9fbf861" />


### Reviews
- POST `/reviews/:movieId` — Add review
  <img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/3867b0ae-8312-4f05-b002-f888af81ab87" />

- GET `/reviews/movie/:movieId` — Get reviews for movie
  <img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/7b63022b-b1af-413b-a431-7b878dfdb7df" />


---

## ▶️ Run Locally

1. Clone repository
```bash
git clone https://github.com/balaussa11/moviedb.git
```
2. Install dependencies
```bash
npm install
```
3.Create .env file
```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```
4.Run server
```bash
npm run dev
```
Server runs on http://localhost:3000
