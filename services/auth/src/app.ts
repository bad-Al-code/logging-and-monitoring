import express, { Application, json, Request, Response } from 'express';

import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';

const app: Application = express();

app.use(json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

app.all('*', async (_req: Request, _res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
