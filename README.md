# 🏠 Room Finder – Full Stack Web Application

A role-based **Room Finder web application** built with **Next.js (App Router)** and **Supabase**, designed to help users find rooms and allow owners to manage their properties efficiently.

This project was developed as part of a **Full Stack Developer Internship Assignment**, demonstrating real-world application flow, authentication, authorization, CRUD operations, and deployment.

---

## 🚀 Live Demo

- **Live Application:**  
  👉 https://room-finder-website-4cp2.vercel.app

- **Role Selection Page:**  
  👉 /select-role

---

## 📌 Project Overview

The Room Finder application supports **two types of users**:

- **User** – Can browse and filter available rooms
- **Owner** – Can add, edit, delete, and manage rooms

The entire flow is **role-based**, secure, and user-friendly.

---

## 🔐 Authentication & Application Flow

1. **Homepage (`/`)**
   - Public landing page
   - Login / Register option (top-right)

2. **Select Role (`/select-role`)**
   - User chooses:
     - `User` → Find rooms
     - `Owner` → List rooms

3. **Register (`/register`)**
   - Role is saved during registration
   - Secure signup using Supabase Auth

4. **Login (`/login`)**
   - Existing users log in
   - Redirected based on role

5. **After Login**
   - **User**
     - Browse rooms
     - Apply filters (location, rent, availability)
   - **Owner**
     - Add new rooms
     - Edit room details
     - Delete rooms
     - View enquiries

---

## ✨ Features

### 🔑 Authentication
- Secure login & signup (Supabase Auth)
- Role-based access control
- Protected routes

### 🏘️ Room Management (Owner)
- Add new rooms
- Edit existing rooms
- Delete rooms
- Upload room images
- Availability status (Available / Booked)

### 🔍 Room Browsing (User)
- View all rooms
- Filter by:
  - Location
  - Maximum rent
  - Availability
- Responsive UI

### 🎨 UI / UX
- Clean and modern design
- Responsive for all devices
- Animated icons and smooth transitions

---

## 🧱 Tech Stack

### Frontend
- **Next.js 16 (App Router)**
- **React**
- **Tailwind CSS**

### Backend / Database
- **Supabase**
  - Authentication
  - PostgreSQL database
  - Storage for images

### Deployment
- **Vercel**

---

## 📁 Project Structure

```txt
room-finder/
│
├── app/
│   ├── add-room/
│   ├── edit-room/[id]/
│   ├── login/
│   ├── register/
│   ├── select-role/
│   ├── my-rooms/
│   ├── my-enquiries/
│   ├── rooms/
│   ├── room/[id]/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
│
├── components/
│   ├── Navbar.js
│   ├── RoomCard.js
│   └── IconButton.js
│
├── lib/
│   ├── supabaseClient.js
│   ├── userAuth.js
│   ├── getUserRole.ts
│   └── icons.js
│
├── public/
│   └── rooms/icons/
│
├── .env.local
├── .gitignore
├── next.config.mjs
├── package.json
└── README.md


⚙️ Environment Variables

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


🛠️ Installation & Setup
# Clone the repository
git clone https://github.com/your-username/room-finder.git

# Navigate into the project
cd room-finder

# Install dependencies
npm install

# Run development server
npm run dev


Open:
👉 http://localhost:3000


📦 Deployment

The application is deployed on Vercel and connected directly to GitHub.

npm run build

Build status:

✅ Successful local build
✅ Production-ready deployment


📈 Completion Status

✅ Frontend & Backend integrated
✅ Secure authentication
✅ CRUD operations implemented
✅ Role-based access
✅ Database integration
✅ Deployed live

Completion: 90%+

👤 Author

Argha Dalal
B.Tech – Computer Science & Engineering
(Specialization: IoT, Cybersecurity & Blockchain)

🌐 GitHub: https://github.com/Argha0004
📧 Email: arghadalal354@gmail.com


📄 License
This project is created for educational and internship evaluation purposes.

---

## ✅ What to do now (VERY IMPORTANT)

1. Paste this into `README.md`
2. Replace:
   - GitHub link
   - Email
   - Username
3. Commit & push:

```bash
git add README.md
git commit -m "Add professional README"
git push origin main
