# CMSPress — Full Stack CMS

A complete Content Management System built with React, Node.js, Express, Sequelize, and MySQL.

---

## Tech Stack

### Backend
- **Node.js + Express** — REST API
- **Sequelize + MySQL** — Database ORM
- **JWT (jsonwebtoken)** — Authentication (no Passport)
- **bcryptjs** — Password hashing
- **Multer** — Image uploads
- **slugify** — URL slug generation

### Frontend
- **React + Vite** — UI framework
- **React Router v6** — Client-side routing
- **Axios** — HTTP requests
- **Swiper.js** — Featured post carousel
- **React Quill** — Rich text editor
- **CSS Modules** — Scoped component styles

---

## Project Structure

```
cms-project/
├── backend/
│   ├── config/         → db.js (Sequelize + MySQL connection)
│   ├── controllers/    → authController, postController, categoryController, userController
│   ├── middleware/     → authMiddleware, roleMiddleware, uploadMiddleware, errorMiddleware
│   ├── models/         → User, Post, Category, index (associations)
│   ├── routes/         → authRoutes, postRoutes, categoryRoutes, userRoutes
│   ├── services/       → authService, postService, categoryService, userService
│   ├── utils/          → jwt.js, password.js, slug.js
│   ├── uploads/        → image files (auto-created)
│   └── server.js       → Express entry point
│
└── frontend/
    └── src/
        ├── api/        → axios.js, postAPI.js, index.js (authAPI, categoryAPI, userAPI)
        ├── components/
        │   ├── carousel/   → FeaturedCarousel (Swiper)
        │   ├── cards/      → PostCard
        │   ├── common/     → Pagination, ProtectedRoute
        │   ├── layout/     → Navbar, Footer, PublicLayout
        │   └── modals/     → ConfirmModal, CategoryModal
        ├── context/    → AuthContext (global auth state)
        ├── hooks/
        │   ├── custom/     → usePosts, useFeaturedPosts, useAdminPosts, useCategories
        │   ├── useForm.js
        │   └── useDebounce.js
        ├── pages/
        │   ├── public/     → HomePage, PostDetailPage
        │   └── admin/      → LoginPage, AdminLayout, DashboardPage,
        │                     PostsListPage, PostFormPage, CategoriesPage, UsersPage
        └── styles/     → globals.css
```

---

## Setup Instructions

### 1. MySQL Database
```sql
CREATE DATABASE cms_db;
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Create First Super Admin
Since the register endpoint is protected (superadmin only), seed the first user directly via MySQL:

```bash
# First install bcryptjs globally or use Node to hash the password
node -e "const b=require('bcryptjs'); b.hash('yourpassword',12).then(h=>console.log(h))"
```

Then in MySQL:
```sql
INSERT INTO users (name, email, password, role, isActive, createdAt, updatedAt)
VALUES ('Super Admin', 'admin@example.com', '<hashed_password>', 'superadmin', true, NOW(), NOW());
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/login | Public |
| POST | /api/auth/register | Super Admin |
| GET | /api/auth/profile | Authenticated |
| PUT | /api/auth/change-password | Authenticated |

### Posts
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/posts | Public |
| GET | /api/posts/featured | Public |
| GET | /api/posts/slug/:slug | Public |
| GET | /api/posts/admin/all | Author+ |
| POST | /api/posts/admin | Author+ |
| PUT | /api/posts/admin/:id | Author+ |
| DELETE | /api/posts/admin/:id | Editor+ |

### Categories
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/categories | Public |
| POST | /api/categories | Editor+ |
| PUT | /api/categories/:id | Editor+ |
| DELETE | /api/categories/:id | Editor+ |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/users | Super Admin |
| PUT | /api/users/:id | Super Admin |
| DELETE | /api/users/:id | Super Admin |

---

## Admin Roles

| Role | Permissions |
|------|------------|
| **superadmin** | Full access — manage users, posts, categories |
| **editor** | Manage posts (including delete) + categories |
| **author** | Create and edit own posts only |

---

## Features

### Public Website
- Hero carousel with featured posts (Swiper.js, auto-rotating)
- Posts grid with category filter tabs and live search
- Full article page with rich text rendering
- Responsive design with mobile navigation

### Admin Dashboard
- Stats overview (total posts, published, drafts, categories)
- Full post management (create, edit, delete, publish/draft toggle)
- Rich text editor (React Quill) with image upload (Multer)
- Featured post toggle (controls carousel appearance)
- Category management with modal
- User management with role assignment (superadmin only)
