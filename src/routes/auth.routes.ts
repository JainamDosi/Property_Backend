import { Router, Request, Response, NextFunction } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  register(req, res).catch(next);
});
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});
export default router;
