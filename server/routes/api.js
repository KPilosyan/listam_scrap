import { Router } from 'express';
import ScraperController from '../controllers/ScraperController';

// Async error handling support
const wrap = fn => (...args) => fn(...args).catch(args[2]);

const router = new Router();

router.post('/start', wrap(async (req, res) => {
    await ScraperController.start(req, res);
}));

export default router;
