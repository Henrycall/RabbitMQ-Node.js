import { Connection, Channel, connect, Message } from "amqplib";

export default class RabbitmqServer {
  private conn: Connection;
  private channel: Channel;

  constructor(private uri: string) {}

  async start(): Promise<void> {
    try {
      this.conn = await connect(this.uri);
      this.channel = await this.conn.createChannel();
    } catch (error) {
      console.error("Error while starting RabbitMQ server:", error);
      throw error;
    }
  }

  async publishInQueue(queue: string, message: string): Promise<void> {
    try {
      await this.channel.assertQueue(queue);
      await this.channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
      console.error("Error publishing message to queue:", error);
      throw error;
    }
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string
  ): Promise<void> {
    try {
      await this.channel.assertExchange(exchange, 'direct', { durable: true });
      await this.channel.publish(exchange, routingKey, Buffer.from(message));
    } catch (error) {
      console.error("Error publishing message to exchange:", error);
      throw error;
    }
  }

  async consume(queue: string, callback: (message: Message) => void): Promise<void> {
    try {
      await this.channel.assertQueue(queue);
      await this.channel.consume(queue, (message) => {
        if (message !== null) {
          callback(message);
          // Uncomment the line below if you want to acknowledge messages
          // this.channel.ack(message);
        }
      });
    } catch (error) {
      console.error("Error consuming messages from queue:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.channel.close();
      await this.conn.close();
    } catch (error) {
      console.error("Error while closing RabbitMQ server:", error);
      throw error;
    }
  }
}
