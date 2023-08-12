const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const databaseConnect = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        console.log("CONNEXION A LA BASE DES DONNEES EFFECTUEES AVEC SUCCESS");
      },
      (error) => {
        console.log("PROBLEME D'ACCES A LA BASE DES DONNEES");
      }
    );
};

module.exports = databaseConnect;
