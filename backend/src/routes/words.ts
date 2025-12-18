import { Router } from 'express';
import {
  getWords,
  getWord,
  createWord,
  updateWord,
  deleteWord,
  bulkImportWords,
  exportWords,
} from '../controllers/wordsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getWords);
router.get('/export', protect, authorize('admin'), exportWords);
router.get('/:id', getWord);
router.post('/', protect, authorize('admin'), createWord);
router.post('/bulk-import', protect, authorize('admin'), bulkImportWords);
router.put('/:id', protect, authorize('admin'), updateWord);
router.put('/:id', protect, authorize('admin'), updateWord);
router.delete('/:id', protect, authorize('admin'), deleteWord);
router.get('/fix-db/now', protect, authorize('admin'), require('../controllers/wordsController').fixDbWords);

export default router;
