const express = require("express")
const logger = require("morgan")
const rabbitmqTestRouter = require("./src/routes/rabbitmq-Route")
const app = express()


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', rabbitmqTestRouter);


app.listen("3000", () => {
    console.log(`Example app listening on port 3000`)
  })

module.exports = app