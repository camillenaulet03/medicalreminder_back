const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointment');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const cors = require("cors");

const corsOptions = {
  origin: [process.env.ENVFRONT, "http://localhost:3000"]
}


const optionsSwagger = {
  definition: {
    info: {
      title: "MedicalReminder API",
      version: "1.0.0",
      description: "",
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ],
  },
  apis: ["./routes/*.js"]
}

const specsSwagger = swaggerJsDoc(optionsSwagger)

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use('/', userRoutes);
app.use('/', appointmentRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specsSwagger));

app.listen(3000);
console.log('start port 3000');
