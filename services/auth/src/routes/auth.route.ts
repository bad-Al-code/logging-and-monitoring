import { Router } from 'express';

import { register } from '../controllers';
import { validateRequest } from '../middlewares/validate-request';
import { registerSchema } from '../schemas';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);

export { router as authRouter };
