<div align="center">

<h1>🏫 StuFix</h1>
<p><strong>College Complaint Management System</strong></p>

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20Demo-stufix.space-blue?style=for-the-badge)](https://stufix.space)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-00E5CC?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)

<p>
  A full‑stack web application that digitises and streamlines the process of lodging, tracking, and resolving infrastructure and service complaints within a college campus — bringing <strong>transparency, accountability, and efficiency</strong> to campus facility management.
</p>

</div>

---

## 🧠 Why StuFix?

In most college campuses, complaints about broken networks, faulty plumbing, or unclean spaces are still reported through informal channels — WhatsApp messages, verbal requests, or forgotten emails. There is no centralised, auditable system to track whether an issue was ever fixed or who was responsible.

**StuFix** solves this by providing:

- 📋 A structured, category‑wise complaint submission portal for students
- 🔧 A role‑based dashboard for workers to update resolution progress
- 👁️ Full visibility and assignment control for administrators
- 📜 An immutable audit trail of every action — creating accountability

---

## ✨ Features

<details>
<summary><strong>👨‍🎓 For Students</strong></summary>
<br>

- Submit complaints under **6 categories**: Network, Cleaning, Carpentry, PC Maintenance, Plumbing, Electricity
- Set priority: **Low / Medium / High**
- Upload **image/video evidence** (stored securely on Cloudinary)
- Track complaint status in **real time**
- View full **status history** of each complaint
- **Withdraw** a complaint (with reason) while it is still open
- **Reopen** a resolved or withdrawn complaint if unsatisfied
- Personal dashboard with statistics: total, pending, resolved, withdrawn

</details>

<details>
<summary><strong>🛠️ For Workers (Maintenance Staff)</strong></summary>
<br>

- Log in to a **department‑scoped** dashboard
- View only complaints **assigned to them** by the admin
- Update status: `Assigned → In Progress → Resolved`
- Add mandatory **resolution remarks** when closing a complaint
- Each status change is **logged permanently**

</details>

<details>
<summary><strong>👔 For Admin (Administrator)</strong></summary>
<br>

- **Full visibility** over all complaints across all users and departments
- Assign or **reassign** any complaint to a worker from the matching department
- Add or delete worker accounts
- View **analytics dashboard**: complaint counts by status, category, and resolution rate
- Access the **complete audit log** for every complaint
- Enforce role‑based access — no unauthorised route access

</details>

---

## 🔐 Authentication & Security

| Feature | Detail |
|---|---|
| Authentication | JWT‑based stateless auth |
| Access Control | Role‑based middleware (User / Worker / Admin) |
| Password Hashing | bcrypt with 10+ salt rounds |
| Signup Verification | Email OTP required |
| CORS | Whitelist prevents unauthorised origins |
| Credentials | Stored in environment variables, never logged |

---

## 🧾 Audit Trail & Accountability

Every significant action is **immutably logged** in the database:

- ✅ Complaint creation / withdrawal / reopening
- ✅ Worker assignment and reassignment (by admin)
- ✅ Every status change — old → new, who changed it, when
- ✅ Resolution remarks and withdrawal reasons

> ⚠️ No `UPDATE` or `DELETE` is permitted on the `audit_logs` table.

---

## ⚙️ Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js (REST API) |
| Database | PostgreSQL (hosted on **Neon**) |
| Media Storage | Cloudinary (CDN for images/videos) |
| Authentication | JWT + bcrypt + Email OTP |
| Email Service | **Nodemailer + Brevo (SMTP)** |
| HTTP Client | TanStack Query + Axios Interceptors |
| Deployment | Client: Vercel · Server: Render |

---

## 📊 Database Schema

| Table | Purpose |
|---|---|
| `users` | All accounts (students, workers, admin) with role & department |
| `complaints` | Main complaint record — title, description, category, priority, status, media URLs |
| `status_history` | Immutable log of every status transition per complaint |
| `audit_logs` | Immutable system‑wide action log |

> 📎 A full Entity‑Relationship Diagram is available in the SRS (Appendix B.2).

---

## 🚀 Getting Started (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/iiitacomplaint-ai/StuFix.git
cd StuFix

# 2. Backend setup
cd server
cp .env.example .env        # Add your real credentials
npm install
npm run dev                 # Runs on http://localhost:3000

# 3. Frontend setup (open another terminal)
cd ../client
cp .env.example .env        # Point to your backend URL
npm install
npm run dev                 # Runs on http://localhost:5173
```

> **Note:** You will need a Neon PostgreSQL connection string, a Cloudinary account with an unsigned upload preset, and Brevo SMTP credentials for email/OTP to work.

---

## 📁 Environment Configuration

<details>
<summary><strong>📄 server/.env</strong></summary>

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require&channel_binding=require

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_characters_long
OTP_SECRET=your_random_otp_secret_min_32_characters

# Email — Nodemailer via Brevo SMTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_brevo_smtp_password
BREVO_FROM_EMAIL=your_email@gmail.com
BREVO_FROM_NAME=StuFix

# Frontend origin (for CORS)
FRONTEND_URL=https://stufix.space

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin seed account
ADMIN_EMAIL=admin@college.edu

# File upload limits
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,video/mp4
```

</details>

<details>
<summary><strong>📄 client/.env</strong></summary>

```env
VITE_API_BASE_URL=https://your-backend-url.com/api

VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

</details>

---

## 🧪 Testing the System

### Sample Accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@iiita.ac.in` | `Student@123` |
| Worker | `worker@iiita.ac.in` | `Worker@123` |
| Admin | `admin@iiita.ac.in` | `Admin@123` |

> The admin account is seeded automatically when the server starts if it does not already exist.

---

## 🔌 API Reference

Base URL: `/api`

### Auth — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/send-otp` | ❌ | Request OTP for signup / password reset |
| `POST` | `/verify-otp` | ❌ | Verify OTP and receive token |
| `POST` | `/signup` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `POST` | `/reset-password` | ❌ | Reset password using OTP token |
| `GET` | `/profile` | ✅ | Get logged‑in user's profile |
| `PUT` | `/profile` | ✅ | Update profile |
| `PUT` | `/change-password` | ✅ | Change password |
| `POST` | `/logout` | ✅ | Logout |

### User (Student) — `/api/user`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Get student profile |
| `GET` | `/dashboard` | Get personal dashboard stats |
| `POST` | `/complaints` | Submit a new complaint |
| `GET` | `/complaints` | List all my complaints |
| `GET` | `/complaints/:id` | Get complaint details |
| `GET` | `/complaints/:id/history` | Get full status history |
| `PUT` | `/complaints/:id/withdraw` | Withdraw an open complaint |
| `PUT` | `/complaints/:id/reopen` | Reopen a resolved/withdrawn complaint |
| `PUT` | `/complaints/:id/priority` | Change complaint priority |

### Admin — `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/createWorker` | Create a new worker account |
| `GET` | `/getWorkers` | List all workers |
| `DELETE` | `/deleteWorker/:user_id` | Delete a worker account |
| `GET` | `/getAllComplaints` | View all complaints (all departments) |
| `POST` | `/assignComplaint` | Assign a complaint to a worker |
| `PUT` | `/reassignComplaint` | Reassign a complaint to another worker |
| `PUT` | `/updateComplaintStatus` | Manually update complaint status |
| `GET` | `/getAuditLogs` | View complete system audit log |

### Worker — `/api/worker`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Get worker profile |
| `GET` | `/dashboard` | Get worker dashboard stats |
| `GET` | `/complaints` | View assigned complaints |
| `GET` | `/complaints/:id` | Get specific complaint details |
| `GET` | `/complaints/:id/history` | Get complaint status history |
| `PUT` | `/complaints/:id/status` | Update complaint status |
| `POST` | `/complaints/:id/remark` | Add a resolution remark |

---

## 🏆 Project Status & Roadmap

**Version 1.0** (Jan 2026 – April 2026) — Full functionality as described above.

**Planned for future releases:**

- [ ] SLA‑based automatic escalation (e.g., unresolved after 3 days → escalated)
- [ ] Real‑time notifications (WebSockets / FCM) for status updates
- [ ] User leaderboard based on resolved complaints (gamification)
- [ ] Internationalisation (i18n) for multiple languages

---

## 👥 Contributors

| Name | Role |
|---|---|
| Abhishek Kumar | Developer |
| Nitin Kumar | Developer |
| Aashray Mahajan | Developer |
| Laxmi Narayan Meena | Developer |

**Department of Information Technology**  
Indian Institute of Information Technology, Allahabad  
Academic Year 2025–2026

---

## 📄 License & Acknowledgements

This project was developed as a browser‑based software system for academic evaluation. It uses open‑source components:

`Express.js` · `React` · `Tailwind CSS` · `PostgreSQL` · `Neon` · `Cloudinary` · `Nodemailer` · `Brevo` · `bcrypt` · `jsonwebtoken`

Special thanks to the faculty of **IIIT Allahabad** for guidance and evaluation.

---

<div align="center">
  <sub>Built with ❤️ by students of IIIT Allahabad</sub>
</div>
