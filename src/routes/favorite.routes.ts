// routes/favorite.routes.ts
import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorite.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken); // user must be logged in

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  addFavorite(req, res).catch(next);
});            // Add to favorites
router.get('/', getFavorites);   
         // Get user's favorites
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  removeFavorite(req, res).catch(next);
});    // Remove from favorites

export default router;
