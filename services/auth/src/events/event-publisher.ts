import logger from '../config/logger';
import { redisClient } from '../lib/redis';

interface EventPayload {
  type: string;
  payload: Record<string, unknown>;
}

export class EventPublisher {
  private streamName: string;

  constructor(streamName: string) {
    this.streamName = streamName;
  }

  public async publish(event: EventPayload): Promise<string> {
    const eventId = await redisClient.xAdd(this.streamName, '*', {
      type: event.type,
      payload: JSON.stringify(event.payload),
    });

    logger.info(
      `Published '${event.type}' event to stream '${this.streamName}`,
      {
        eventId,
        payload: event.payload,
      }
    );

    return eventId;
  }
}
