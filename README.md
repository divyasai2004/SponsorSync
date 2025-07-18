# SponsorSync – Smart Sponsorship & Brand Matchmaking Engine

SponsorSync is a modern web application that connects student clubs/organizers with sponsors/brands for smarter, easier event partnerships. It provides matchmaking, profile management, in-app messaging, and more—all in a beautiful, responsive UI.

---

## 🚀 Features

- **User Types:**
  - Student Club / Organizer
  - Sponsor / Brand
- **Authentication:** Register/Login with email & password (role-based)
- **Profile Management:**
  - Student Clubs: Event name, description, theme, audience, reach, social stats, past events, sponsorship requirements
  - Sponsors: Brand name, website, industry, audience, goals, region, budget
- **Smart Matchmaking:**
  - Rule-based matching with match % score
  - Filter matches by industry and audience
- **Communication:**
  - In-app messaging (text, threads, new message by email)
  - (Planned) File upload for proposals
- **Modern UI:**
  - Responsive, mobile-friendly, and visually engaging
  - Dashboard, profile, matches, and messaging pages

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router, React, Tailwind CSS)
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Authentication:** JWT (JSON Web Tokens)
- **Icons/UI:** Heroicons, Tailwind

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/your-username/sponsorsync.git
cd sponsorsync
```

### 2. Install dependencies
#### Backend
```sh
cd backend
npm install
```
#### Frontend
```sh
cd ../frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` folder:
```
MONGO_URI=mongodb://localhost:27017/sponsorsync
PORT=5000
JWT_SECRET=your_jwt_secret
```

### 4. Start the servers
#### Backend
```sh
cd backend
node server.js
```
#### Frontend
```sh
cd frontend
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## 🧑‍💻 Usage
- Register as a Student Club or Sponsor
- Complete your profile
- View and filter matches (with match %)
- Start conversations via in-app messaging
- (Planned) Upload and share proposals/files in messages

---

## 🌱 Contributing
1. Fork this repo and clone your fork
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request on GitHub

---

## 📄 License
MIT

---

## 🙏 Acknowledgements
- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)

---

**SponsorSync – Smart Sponsorship & Brand Matchmaking Engine**
