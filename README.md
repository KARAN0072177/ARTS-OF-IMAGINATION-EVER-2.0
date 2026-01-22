# 🎨 Arts of Imagination Ever

## 📌 Overview

**Arts of Imagination Ever** is a **full-stack MERN-based art showcase platform** built as a **portfolio project** to demonstrate real-world system design, authentication flows, media handling, and personalized content delivery.

The platform allows artists to showcase **AI-generated original artworks** without the heavy restrictions commonly found on platforms like Pinterest or Instagram, while providing users with advanced discovery, interaction, and download capabilities.

This project focuses on **system thinking**, **security**, and **feature completeness**, rather than being a minimal demo app.

---

## 🎯 Purpose of the Project

This project was built as a **portfolio project** with the following goals:

- To demonstrate strong understanding of the **MERN stack**
- To design a **feature-rich platform**, not just CRUD
- To implement **multiple authentication methods**
- To integrate a **recommendation system** using Flask
- To build a **secure admin panel** with real-time monitoring
- To showcase **solo project ownership** and architecture decisions

---

## 🧠 What Problem It Solves

- Artists need a platform to showcase **original AI-generated art** without restrictive guidelines
- Users want:
  - High-quality downloadable images
  - Personalized content discovery
  - Clear ownership and no copyright ambiguity
- Admins need:
  - Control over content
  - Real-time activity insights
  - Secure management tools

---

## ✨ Key Features

### 🔐 Authentication & Security
- Multiple login methods:
  - Email & Password
  - Google
  - GitHub
  - Discord
- Session-based authentication
- Mandatory **unique username** for every user
- Dedicated admin login with:
  - Protected routes
  - Google CAPTCHA
- Environment-based secret management

---

### 🖼️ Artwork & User Features
- Upload AI-generated artworks with:
  - Title
  - Description
  - Tags
- Like, share, and download artworks
- Real interaction counts (likes, shares, downloads)
- Dedicated page to view liked artworks
- Premium image downloads:
  - 2K
  - 4K
  - 8K (premium)
- Premium download links expire after **30 minutes**

---

### 🧠 Recommendation System
- Content-based recommendation system
- Built using **Flask (Python)**
- Uses:
  - User click behavior
  - Category frequency
- Background processing to update recommendations
- Designed as a **separate service**, not mixed with Node.js backend
- Intentionally simple and explainable (not advanced ML)

---

### 🛠️ Admin Panel
- Fully functional admin dashboard
- Secure admin authentication
- Real-time monitoring using **WebSockets**
- Manage content and platform activity
- Designed separately from user-facing UI

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Plain CSS (used selectively for animations)
- Deployed on **Vercel**

### Backend
- Node.js
- Express.js
- Session-based authentication
- Deployed on **Render**

### Recommendation Service
- Python
- Flask
- MongoDB (via PyMongo)
- Deployed on **Render**

### Database
- MongoDB Atlas


---

## 🚀 Deployment Strategy

- Frontend: Vercel
- Backend API: Render
- Flask Recommendation Service: Render  
  *(Can also be deployed together depending on setup)*

Environment variables are managed securely and are **not committed to GitHub**.

---

## ⚠️ Project Status & Limitations

- This project is **not production-ready yet**
- Currently undergoing:
  - Code cleanup
  - Optimization
  - UI refinement
- Recommendation system is **basic by design**
- Scalability improvements are planned but not implemented yet

---

## 🔮 Future Improvements

If extended further, the following areas would be improved:

1. UI & UX refinement
2. More advanced recommendation logic
3. Performance and query optimization

---

## 👤 Author

**Karan Vani**  
**Next.js + MERN Developer**  
Solo Project

---

## 📄 License

This project is created for **educational and portfolio purposes**.  
All showcased artworks are **original AI-generated images**, avoiding copyright issues.
