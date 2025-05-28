# Environment Setup Guide

## Important: Stripe API Keys

This project uses Stripe for payment processing. To set up the environment variables:

### Frontend (.env)
1. Copy `frontend/.env.example` to `frontend/.env`
2. Replace `your_stripe_publishable_key_here` with your actual Stripe publishable key

### Backend (.env)
1. Copy `backend/.env.example` to `backend/.env` 
2. Replace `your_stripe_secret_key_here` with your actual Stripe secret key

### Security Notes
- Never commit actual API keys to version control
- The `.env` files are already in `.gitignore`
- Always use environment variables for sensitive data
- Regenerate your Stripe keys if they've been exposed

### Getting Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API keys
3. Copy your publishable key (starts with `pk_test_` or `pk_live_`)
4. Copy your secret key (starts with `sk_test_` or `sk_live_`)

### Example Environment Files

**frontend/.env**
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/movie_booking_db
JWT_SECRET=MoviesProjectSecret@123
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```
