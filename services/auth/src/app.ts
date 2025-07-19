import express, { Application, json, Request, Response } from 'express';

import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';
import { authRouter } from './routes';

const app: Application = express();

app.use(json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
