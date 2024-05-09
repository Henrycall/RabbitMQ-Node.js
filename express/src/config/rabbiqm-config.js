const { connect } = require('amqplib');

class RabbitmqServer {
  constructor(uri) {
    this.uri = uri; // Recebe o URI do servidor RabbitMQ
    this.conn = null; // Objeto de conexão com o servidor RabbitMQ
    this.channel = null; // Objeto de canal para comunicação com o servidor RabbitMQ
  }

  async start() {
    try {
      this.conn = await connect(this.uri); // Estabelece conexão com o servidor RabbitMQ
      this.channel = await this.conn.createChannel(); // Cria um canal para comunicação
      console.log('Conectado ao RabbitMQ'); // Registra a conexão bem-sucedida
    } catch (error) {
      console.error('Erro ao conectar ao RabbitMQ:', error.message); // Registra erro se a conexão falhar
      throw error; // Lança o erro para tratamento em outro lugar
    }
  }

  async publishInQueue(queue, message) {
    try {
      await this.channel.assertQueue(queue); // Verifica a existência de uma fila
      await this.channel.sendToQueue(queue, Buffer.from(message)); // Envia mensagem para a fila especificada
      console.log('Mensagem publicada na fila:', message); // Registra a publicação bem-sucedida
    } catch (error) {
      console.error('Erro ao publicar mensagem na fila:', error.message); // Registra erro se a publicação falhar
      throw error; // Lança o erro para tratamento em outro lugar
    }
  }

  async publishInExchange(exchange, routingKey, message) {
    try {
      await this.channel.assertExchange(exchange, 'direct', { durable: true }); // Verifica a existência de uma exchange
      await this.channel.publish(exchange, routingKey, Buffer.from(message)); // Publica mensagem na exchange especificada
      console.log('Mensagem publicada na exchange:', message); // Registra a publicação bem-sucedida
    } catch (error) {
      console.error('Erro ao publicar mensagem na exchange:', error.message); // Registra erro se a publicação falhar
      throw error; // Lança o erro para tratamento em outro lugar
    }
  }

  async consume(queue, callback) {
    try {
      await this.channel.assertQueue(queue); // Verifica a existência de uma fila
      await this.channel.consume(queue, (message) => { // Consome mensagens da fila especificada
        if (message !== null) { // Verifica se a mensagem não é nula
          callback(message); // Executa a função de retorno para processamento da mensagem
          this.channel.ack(message); // Reconhece o processamento da mensagem
        }
      });
      console.log('Consumindo mensagens da fila:', queue); // Registra o consumo bem-sucedido de mensagens
    } catch (error) {
      console.error('Erro ao consumir mensagens da fila:', error.message); // Registra erro se o consumo falhar
      throw error; // Lança o erro para tratamento em outro lugar
    }
  }

  async close() {
    try {
      await this.channel.close(); // Fecha o canal
      await this.conn.close(); // Fecha a conexão com o servidor RabbitMQ
      console.log('Conexão com o RabbitMQ fechada'); // Registra o fechamento bem-sucedido
    } catch (error) {
      console.error('Erro ao fechar conexão com o RabbitMQ:', error.message); // Registra erro se o fechamento falhar
      throw error; // Lança o erro para tratamento em outro lugar
    }
  }
}

module.exports = RabbitmqServer; // Exporta a classe RabbitmqServer para uso externo
