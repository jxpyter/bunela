# Bunela - Vocabulary Learning Platform

A modern web application for learning English vocabulary using spaced repetition (SM-2 algorithm).

## Ekran Görüntüleri

### Anasayfa
<img width="1920" height="1080" alt="Homepage" src="https://github.com/user-attachments/assets/ce91d7ff-0535-40c8-98c7-3bd050eabe79" />
<img width="1920" height="1080" alt="Homepage2" src="https://github.com/user-attachments/assets/d24f3713-f323-477d-b5f9-b6aabe09232f" />

### Words
<img width="1920" height="1080" alt="Words" src="https://github.com/user-attachments/assets/330eaa22-6c14-4844-b649-e140dd1c904c" />

### Panel
<img width="1920" height="1080" alt="Panel" src="https://github.com/user-attachments/assets/051e67f9-906f-40fd-a809-dfc5876bf5d7" />
<img width="1920" height="1080" alt="AddWord" src="https://github.com/user-attachments/assets/41556f93-c44e-4f23-a866-7d99c3603702" />


## 🚀 Features

- **Smart Learning**: SM-2 spaced repetition algorithm for optimal retention
- **Multi-Level Support**: Words categorized from A1 to C2 (CEFR levels)
- **Beautiful UI**: Modern design with glassmorphism and smooth animations
- **Progress Tracking**: Streak counter, statistics, and learning progress
- **Admin Panel**: CMS for managing words, bulk import/export
- **User Authentication**: JWT-based secure authentication

## 🛠️ Tech Stack

### Backend

- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Rate Limiting & Compression

### Frontend

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React Query (TanStack Query)
- Framer Motion
- Axios

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@bunela.com
ADMIN_PASSWORD=admin123
```

### Database Seeding

> **Note:** The seed and control scripts have been removed from this project. You will need to create your own script or use the Admin Panel to populate the database with words.

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Dashboard**: View your learning statistics and progress
3. **Learn**: Review due words and learn new vocabulary
4. **Admin Panel**: Manage words (admin only) - login with `admin@bunela.com` / `admin123`

## 📊 SM-2 Algorithm

The application uses the SM-2 spaced repetition algorithm to optimize learning:

- Quality ratings: 0-5 (0 = complete blackout, 5 = perfect recall)
- Automatic scheduling of reviews
- Adaptive difficulty based on your performance

## 🗂️ Project Structure

```
bunela/
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── models/       # Mongoose schemas (User, Word, UserProgress)
│   │   ├── routes/       # API routes (auth, words, progress)
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, validation
│   │   ├── services/     # SM-2 algorithm implementation
│   │   └── scripts/      # Database seeding
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/              # Next.js app router pages
│   │   ├── admin/        # Admin panel
│   │   ├── dashboard/    # User dashboard
│   │   ├── learn/        # Learning interface
│   │   ├── login/        # Authentication
│   │   └── register/     # User registration
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   └── ...           # Custom components
│   ├── context/          # React context providers
│   ├── lib/              # API client, utilities
│   ├── types/            # TypeScript type definitions
│   ├── public/           # Static assets
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── package.json          # Root dependencies
└── README.md
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/settings` - Update settings

### Words

- `GET /api/words` - Get all words
- `GET /api/words/:id` - Get single word
- `POST /api/words` - Create word (admin)
- `PUT /api/words/:id` - Update word (admin)
- `DELETE /api/words/:id` - Delete word (admin)
- `POST /api/words/bulk-import` - Bulk import (admin)

### Progress

- `GET /api/progress/due` - Get due words
- `GET /api/progress/new` - Get new words
- `POST /api/progress/review` - Submit review
- `GET /api/progress/stats` - Get statistics

## 🎨 Design Features

- Gradient backgrounds
- Glassmorphism effects
- 3D flip card animations
- Smooth transitions
- Responsive design
- Dark theme support

## 📄 License

MIT

## 👥 Author

jxpyter
