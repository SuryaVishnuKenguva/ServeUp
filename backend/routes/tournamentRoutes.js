const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getOrganizerTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  addEvent,
  updateEvent,
  deleteEvent,
  uploadTournamentPoster,
  getTopTournaments,
  getAllTournaments,
  getPublicTournamentById,
  updateFixture // Add this import
} = require('../controllers/tournamentController');

router.get('/top', getTopTournaments);

// Public routes
router.get('/top', getTopTournaments);
router.get('/all', getAllTournaments);
router.get('/public/:id', getPublicTournamentById);

// All routes are protected and require authentication
router.use(protect);

// Tournament routes
router.route('/organizer')
  .get(getOrganizerTournaments);

router.route('/')
  .post(uploadTournamentPoster, createTournament);

router.route('/:id')
  .get(getTournamentById)
  .put(uploadTournamentPoster, updateTournament)
  .delete(deleteTournament);

// Event routes
router.route('/:id/events')
  .post(addEvent);

router.route('/:id/events/:eventId')
  .put(updateEvent)
  .delete(deleteEvent);

// Fixture routes
router.route('/fixtures')
  .put(updateFixture); // No need for protect middleware here as router.use(protect) applies it to all routes

module.exports = router;