const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const databaseConnect = require('./config/databaseConfig')

const app = express();

require("dotenv").config();
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send("PAGE D'ACCEUIL DU SERVER !");
});


databaseConnect();

app.listen(PORT, () => {
  console.log(`LE SERVER ECOUTE SUR LE PORT : ${PORT}`);
})

// DB_URL=mongodb://127.0.0.1/AUTHENTICATE
// PORT=8000
// NODE_ENV=development