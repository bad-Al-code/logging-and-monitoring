import { app } from './app';
import logger from './config/logger';
import './lib/redis';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Auth Service running on port: ${PORT}`);
});
