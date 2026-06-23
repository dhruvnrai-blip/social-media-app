[README.md](https://github.com/user-attachments/files/29253524/README.md)
# 🌐 Social Media App

A full-stack social media web application built with **React 19 + Vite** on the frontend and **Node.js/Express 5 + Prisma** on the backend. Users can create posts, repost, bookmark, and manage their profiles — all in a clean dark-purple UI.

---

## ✨ Features

- **Authentication** — JWT-based signup/login with bcrypt password hashing, cookie-based token storage, and email verification via Nodemailer
- **Media Uploads** — Image hosting powered by Cloudinary + Multer
- **Feed** — View and create posts
- **Reposts** — Reshare content to your own profile
- **Bookmarks** — Save posts, accessible from your profile
- **Profile Page** — Tab-based layout: **Posts**, **Bookmarks**, **Reposts**
- **Input Validation** — Server-side schema validation with Zod
- **Security** — HTTP headers hardened with Helmet, request logging via Morgan

---

## 🛠 Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | React 19, Vite, React Router v7, Axios             |
| Backend    | Node.js, Express 5                                 |
| ORM        | Prisma                                             |
| Auth       | JWT, bcrypt, cookie-parser                         |
| Media      | Cloudinary, Multer                                 |
| Validation | Zod                                                |
| Email      | Nodemailer                                         |
| Dev Tools  | Nodemon, ESLint, Helmet, Morgan                    |

---

## 📁 Project Structure

```
social-media-app/
├── Frontend/                  # Vite + React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout.jsx        # Layout with auth context, no prop drilling
│   │   │   ├── PostCard.jsx         # Post card with repost & bookmark actions
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Profile.jsx          # Posts / Bookmarks / Reposts tabs
│   │   │   ├── Feed.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── api/
│   │   │   ├── axiosInstance.js     # Shared Axios instance with interceptors
│   │   │   └── postApi.js           # Post, repost, bookmark API calls
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
└── Backend/                   # Express + Prisma API
    ├── src/
    │   ├── routes/
    │   ├── middleware/
    │   ├── controllers/
    │   └── server.js
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm
- A running PostgreSQL (or other Prisma-compatible) database
- Cloudinary account (for media uploads)
- SMTP credentials (for email verification)

### 1. Clone the repository

```bash
git clone https://github.com/raidhruv/social-media-app.git
cd social-media-app
```

### 2. Set up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/socialmedia
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Run Prisma migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

The backend runs at `http://localhost:5000`.

### 3. Set up the Frontend

```bash
cd ../Frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` (Vite default).

---

## 🔑 Authentication Flow

1. User signs up → password hashed with **bcrypt**, verification email sent via **Nodemailer**
2. User verifies email → account activated
3. User logs in → server issues a **JWT** stored in an HTTP-only cookie
4. Frontend attaches credentials via a shared **Axios instance** with interceptors — no per-request token handling

---

## 👤 Profile Tabs

| Tab | Description |
|---|---|
| **Posts** | All original posts by the user |
| **Bookmarks** | Posts the user has saved |
| **Reposts** | Posts the user has reshared |

---

## 📸 Key Components

### `AppLayout.jsx`
Self-contained layout wrapper managing app-wide auth state via React Context, eliminating prop drilling across the component tree.

### `PostCard.jsx`
Reusable card rendering individual posts with toggle support for reposts and bookmarks.

### `postApi.js`
Centralized API module for all post-related requests using the shared Axios instance.

---

## 🎨 Theme

Dark purple color scheme with consistent inline CSS-in-JS styling across all pages.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---
