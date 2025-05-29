# 🎬 BookMyShow - Movie Booking Platform

A full-stack movie booking platform built with React.js, Node.js, Express.js, and MongoDB. This application allows users to browse movies, book tickets, and provides admin and partner dashboards for management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- 🔐 User authentication (Register, Login, Forgot Password)
- 🎬 Browse available movies
- 📅 View movie details and show timings
- 🎫 Interactive seat selection
- 💳 Secure payment integration with Stripe
- 📱 Responsive design for mobile and desktop
- 📧 Email notifications for bookings
- 📋 View booking history

### Admin Features
- 🎭 Manage movies (Add, Edit, Delete)
- 🏢 Approve/Block theatre registrations
- 📊 Dashboard with overview statistics
- 👥 User management capabilities

### Partner Features
- 🏢 Register and manage theatres
- 📅 Add and manage show schedules
- 🎫 Set ticket prices and seat configurations
- 📈 View booking analytics
- ✏️ Edit theatre information

### Technical Features
- 🔒 JWT-based authentication
- 🛡️ Input validation and sanitization
- ⚡ Rate limiting for API protection
- 🎨 Modern UI with Ant Design
- 📱 Mobile-responsive design
- 🔄 Loading states for better UX
- 🚨 Comprehensive error handling
- 📧 Email service integration

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **Redux Toolkit** - State management
- **React Router Dom** - Client-side routing
- **Ant Design** - UI component library
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Stripe Checkout** - Payment processing
- **Moment.js** - Date manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
doc_project/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controller/
│   │   ├── movieController.js    # Movie management logic
│   │   └── theatreController.js  # Theatre management logic
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── rateLimitMiddleware.js # API rate limiting
│   │   └── validationMiddleware.js # Input validation
│   ├── models/
│   │   ├── userModel.js         # User schema
│   │   ├── movieModel.js        # Movie schema
│   │   ├── theatreModel.js      # Theatre schema
│   │   ├── showModel.js         # Show schema
│   │   └── bookingModel.js      # Booking schema
│   ├── routes/
│   │   ├── userRoutes.js        # Authentication routes
│   │   ├── movieRoutes.js       # Movie CRUD routes
│   │   ├── theatreRoutes.js     # Theatre management routes
│   │   ├── showRoutes.js        # Show management routes
│   │   └── bookingRoutes.js     # Booking and payment routes
│   ├── utils/
│   │   ├── emailHelper.js       # Email service utilities
│   │   └── email_templates/     # HTML email templates
│   ├── package.json
│   └── index.js                 # Server entry point
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/                 # API service functions
│   │   ├── components/
│   │   │   └── ProtectedRoute.js # Route protection component
│   │   ├── pages/
│   │   │   ├── Admin/           # Admin dashboard pages
│   │   │   ├── Partner/         # Partner dashboard pages
│   │   │   ├── User/            # User pages
│   │   │   ├── Home/            # Public pages
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── redux/               # State management
│   │   ├── utils/               # Utility functions
│   │   ├── App.js               # Main app component
│   │   ├── App.css              # Global styles
│   │   └── index.js             # App entry point
│   └── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Stripe account for payments
- Email service account (Gmail, etc.)

### Clone the Repository
```bash
git clone <repository-url>
cd doc_project
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)

# Start the development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Stripe publishable key

# Start the development server
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/bookmyshow
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookmyshow

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Base URL
REACT_APP_API_URL=http://localhost:5000
```

## 📖 Usage

### Getting Started

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   Application will open on `http://localhost:3000`

### User Registration & Login

1. **Register as a new user**
   - Navigate to `/register`
   - Choose user role: Customer, Partner, or Admin
   - Fill in required details

2. **Login**
   - Navigate to `/login`
   - Use registered credentials

### Booking a Movie

1. Browse available movies on the home page
2. Click on a movie to view details
3. Select a show time and theatre
4. Choose your preferred seats
5. Proceed to payment with Stripe
6. Receive confirmation email

### Admin Operations

1. **Movie Management**
   - Add new movies with details and posters
   - Edit existing movie information
   - Delete movies from the system

2. **Theatre Management**
   - View all theatre registration requests
   - Approve or block theatre applications

### Partner Operations

1. **Theatre Management**
   - Register new theatres
   - Edit theatre information
   - Delete theatres

2. **Show Management**
   - Add show schedules for movies
   - Set ticket prices and seat configurations
   - Manage show timings

## 👥 User Roles

### Customer
- Browse and book movies
- View booking history
- Manage profile

### Partner (Theatre Owner)
- Manage theatres
- Add and manage shows
- Set pricing and schedules

### Admin
- Manage all movies
- Approve/reject theatres
- System administration

## 🎨 Key Features Implementation

### Loading States
All buttons that trigger API calls include loading states to improve user experience:
- Form submission buttons show spinners
- Action buttons disable during API calls
- Payment buttons show processing state

### Error Handling
Comprehensive error handling system:
- Input validation with detailed error messages
- Network error handling
- Rate limiting protection
- User-friendly error notifications

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input sanitization and validation
- Rate limiting for API protection
- CORS configuration
- Helmet security headers
---

**Made with ❤️ by Murikipudi Chanakya Sai**
