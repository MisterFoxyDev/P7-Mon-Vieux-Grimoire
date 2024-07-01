const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

exports.signup = (req, res) => {
  if (!validateEmail(req.body.email)) {
    return res.status(400).json({ message: "Adresse email invalide." });
  }
  // Vérifier si l'utilisateur existe déjà
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        // Si l'utilisateur existe déjà, renvoyer un code 409 (Conflit)
        return res.status(409).json({ message: "L'utilisateur existe déjà." });
      }
      // Si l'utilisateur n'existe pas, procéder à la création
      bcrypt
        .hash(req.body.password, 10)
        .then(hash => {
          const newUser = new User({
            email: req.body.email,
            password: hash,
          });
          newUser
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch(err => res.status(500).json({ err }));
        })
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Identifiant ou mot de passe incorrect" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Identifiant ou mot de passe incorrect" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  {
                    userId: user._id,
                  },
                  process.env.TOKEN_SECRET,
                  {
                    expiresIn: "24h",
                  }
                ),
              });
            }
          })
          .catch((err) => {
            res.status(500).json({ err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};
