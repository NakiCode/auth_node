const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const databaseConnect = require('./config/databaseConfig')
// IMPORTATION DES MIDDLEWARES
const interceptor = require('./middleware/errorInterceptor')
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


app.get('/', (req, res) => {
  res.send("PAGE D'ACCEUIL DU SERVER !");
});
// LES MIDDLEWARES
app.use(interceptor)
databaseConnect();

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`LE SERVER ECOUTE SUR LE PORT : ${PORT}`);
})

