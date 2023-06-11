const express = require("express");
const connection = require("./db");
const userrouter = require("./router/user.router");
const noterouter = require("./router/note.router");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const cors = require("cors");
app.use(express.json());
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "notes api documentation Swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
      {
        url: "http://localhost:4500",
      },
    ],
  },
  apis: ["./router/*.js"],
};
const swaggerSpec = swaggerJSdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use("/user", userrouter);
app.use("/notes", noterouter);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connection established");
  } catch (error) {
    console.log(error);
  }
  console.log("server listening");
});
