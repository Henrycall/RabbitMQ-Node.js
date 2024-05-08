
const express = require('express');
const router = express.Router();

const RabbitmqServer = require('../config/rabbiqm-config');

router.post('/express', async function(req, res) {
  
    const server = new RabbitmqServer('amqp://admin:admin@rabbitmq:5672');
    await server.start();
   
     // Exemplo de publicação em fila
    await server.publishInQueue('nest', JSON.stringify(req.body));

      // Exemplo de publicação em troca (exchange)
   // await server.publishInExchange('amq.direct', 'rota', JSON.stringify(req.body));
    res.send(req.body)
    
  });

module.exports = router;