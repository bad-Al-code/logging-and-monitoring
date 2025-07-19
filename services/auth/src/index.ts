import { app } from './app';
import { env } from './config';
import logger from './config/logger';
import './lib/redis';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Auth Service running on port: ${PORT}`);
});
