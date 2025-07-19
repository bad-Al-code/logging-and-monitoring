import { app } from './app';
import './lib/redis';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth Service running on port: ${PORT}`);
});
