import winston from 'winston';
import { env } from './env';

const { combine, colorize, timestamp, splat, errors, printf, json } =
  winston.format;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatMeta = (meta: any): string => {
  const splat = meta[Symbol.for('splat')];
  if (splat && splat.length) {
    if (typeof splat[0] === 'object') {
      return JSON.stringify(splat[0], null, 2);
    }
  }
  return '';
};

const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format:
    env.NODE_ENV === 'development'
      ? combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          splat(),
          errors({ stack: true }),
          printf(
            (info) =>
              `${info.timestamp} ${info.level}: ${info.message} ${formatMeta(info)} ${
                info.stack ? `\n${info.stack}` : ''
              }`
          )
        )
      : combine(timestamp(), splat(), errors({ stack: true }), json()),

  transports: [new winston.transports.Console()],
});

export default logger;
