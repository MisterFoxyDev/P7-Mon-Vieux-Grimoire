const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

const app = express();

//CONNEXION BD
mongoose
  .connect(
    "mongodb+srv://hugothomas90:kTLruGHm4VlhMxeC@cluster0.y3tdvi8.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => console.log("connexion à MongoDB réussie !"))
  .catch(() => console.log("La connexion à MongoDG a échoué !"));

//Avec ce middleware, Express prend toutes les requêtes qui ont comme Content-Type application/json et met à disposition leur body directement sur l'objet req.
app.use(express.json());

//Paramétrage des headers pour régler les problèmes de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
