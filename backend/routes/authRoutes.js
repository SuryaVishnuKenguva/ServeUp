const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, verifyOTP, resendOTP, completeProfile } = require('../controllers/authcontroller.js');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = require('../controllers/authcontroller').generateToken(req.user._id);
    
    // Redirect to frontend with token and user info
    const userData = JSON.stringify({
      token,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profileComplete: req.user.profileComplete
      }
    });
    
    // Redirect based on profile completion status
    if (!req.user.profileComplete) {
      res.redirect(`http://localhost:5173/complete-profile?data=${encodeURIComponent(userData)}`);
    } else {
      res.redirect(`http://localhost:5173/organizer/home?data=${encodeURIComponent(userData)}`);
    }
  }
);

// Profile completion route
router.post('/complete-profile', protect, completeProfile);

// Protected routes
router.post('/verify-otp', protect, verifyOTP);
router.post('/resend-otp', protect, resendOTP);

module.exports = router;