import { Router } from 'express';

import { login, register } from '../controllers';
import { validateRequest } from '../middlewares/validate-request';
import { loginSchema, registerSchema } from '../schemas';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export { router as authRouter };
