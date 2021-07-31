const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");

//environment variables
dotenv.config({
  path: "./config/env/config.env",
});

//mongoDB connection
connectDatabase();

const PORT = process.env.PORT;
const app = express();

//Express - Body MiddleWare
app.use(express.json());

//routers middleware
app.use("/api", routers);

//error middleware
app.use(customErrorHandler);

//static files
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Server started");
});
