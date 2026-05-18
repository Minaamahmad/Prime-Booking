<div align="center">

# 🏨 Prime Booking

### Multi-vendor hotel booking platform built with the MERN stack

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://your-live-link.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Minaamahmad-black?style=for-the-badge&logo=github)](https://github.com/Minaamahmad)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=flat&logo=auth0&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📸 Screenshots

> Add screenshots here — frontend dashboard, owner panel, real-time chat, admin panel.
> <img width="1263" height="900" alt="Capture 1" src="https://github.com/user-attachments/assets/015e5653-2ba0-47b4-a29a-ab3bb48bc253" />

> Tip: Drag images directly into this file on GitHub to upload them.

---

## ✨ Features

### For Guests
- Browse hotels and rooms with full details and availability
- Book rooms with real-time status updates
- Real-time chat with hotel owners via Socket.io
- Secure login with Google OAuth (via Auth0)

### For Hotel Owners
- List and manage multiple hotels and rooms (CRUD)
- View and manage bookings from a dedicated dashboard
- Real-time messaging with guests

### For Admins
- Full platform oversight — manage users, hotels, and bookings
- Role-based access control (Guest / Owner / Admin)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Real-time | Socket.io |
| Authentication | Auth0, JWT |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🗄️ Database Schema

Five core entities:

```
User → Hotel → Room → Booking
                         ↕
                      Message
```

- **User** — roles: Guest, Owner, Admin
- **Hotel** — belongs to Owner, has many Rooms
- **Room** — belongs to Hotel, bookable by Guests
- **Booking** — links Guest ↔ Room, tracks status
- **Message** — real-time chat between Guest ↔ Owner

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Auth0 account

### Clone and install

```bash
git clone https://github.com/Minaamahmad/prime-booking.git
cd prime-booking

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment variables

Create `.env` in `/server`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
PORT=5000
```

Create `.env` in `/client`:

```env
VITE_API_URL=http://localhost:5000
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
```

### Run locally

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## 📁 Project Structure

```
prime-booking/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── context/         # Auth & app state
│   │   └── socket/          # Socket.io client setup
├── server/                  # Express backend
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & role guards
│   └── socket/              # Socket.io server setup
```

---

## 🔐 Role-Based Access

| Feature | Guest | Owner | Admin |
|---|:---:|:---:|:---:|
| Browse hotels & rooms | ✅ | ✅ | ✅ |
| Book rooms | ✅ | ❌ | ❌ |
| Real-time chat | ✅ | ✅ | ❌ |
| Manage own hotels | ❌ | ✅ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |

---

## 🗺️ Roadmap

- [ ] Stripe payment integration
- [ ] Email booking confirmations
- [ ] Room availability calendar
- [ ] Review and rating system

---

## 👨‍💻 Author

**Minaam Ahmad**  
MERN Stack Developer · TypeScript · Node.js  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://linkedin.com/in/your-profile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/Minaamahmad)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
