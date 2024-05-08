const { connect } = require('amqplib');

class RabbitmqServer {
  constructor(uri) {
    this.uri = uri;
    this.conn = null;
    this.channel = null;
  }

  async start() {
    try {
      this.conn = await connect(this.uri);
      this.channel = await this.conn.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error.message);
      throw error;
    }
  }

  async publishInQueue(queue, message) {
    try {
      await this.channel.assertQueue(queue);
      await this.channel.sendToQueue(queue, Buffer.from(message));
      console.log('Message published to queue:', message);
    } catch (error) {
      console.error('Error publishing message to queue:', error.message);
      throw error;
    }
  }

  async publishInExchange(exchange, routingKey, message) {
    try {
      await this.channel.assertExchange(exchange, 'direct', { durable: true });
      await this.channel.publish(exchange, routingKey, Buffer.from(message));
      console.log('Message published to exchange:', message);
    } catch (error) {
      console.error('Error publishing message to exchange:', error.message);
      throw error;
    }
  }

  async consume(queue, callback) {
    try {
      await this.channel.assertQueue(queue);
      await this.channel.consume(queue, (message) => {
        if (message !== null) {
          callback(message);
          this.channel.ack(message);
        }
      });
      console.log('Consuming messages from queue:', queue);
    } catch (error) {
      console.error('Error consuming messages from queue:', error.message);
      throw error;
    }
  }

  async close() {
    try {
      await this.channel.close();
      await this.conn.close();
      console.log('Connection to RabbitMQ closed');
    } catch (error) {
      console.error('Error closing connection to RabbitMQ:', error.message);
      throw error;
    }
  }
}

module.exports = RabbitmqServer;
