import express, { Application, json, Request, Response } from 'express';

const app: Application = express();

app.use(json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

export { app };
