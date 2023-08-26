const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require("cors");

const corsOptions = {
  origin: [process.env.ENVFRONT]
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.listen(3000);
console.log('start port 3000');
