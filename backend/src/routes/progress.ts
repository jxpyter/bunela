import express, { Router } from 'express';
import { getDueWords, getNewWords, submitReview, getStats, getPracticeWords, resetProgress } from '../controllers/progressController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/due', getDueWords);
router.get('/new', getNewWords);
router.get('/practice', getPracticeWords);
router.get('/stats', getStats);
router.post('/review', submitReview);
router.post('/reset', resetProgress);

export default router;
