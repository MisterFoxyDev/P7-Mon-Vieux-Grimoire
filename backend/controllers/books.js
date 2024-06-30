const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");

//CREATE
exports.createBook = (req, res) => {
  const bookObj = JSON.parse(req.body.book);
  console.log("🚀 ~ bookObj:", req.body)
  delete bookObj._id;
  delete bookObj._userId;
  const book = new Book({
    ...bookObj,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((err) => res.status(400).json({ err }));
};

//READ
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => res.status(400).json({ err }));
};
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ err }));
};
exports.getBestRating = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      console.log("🚀 ~ books:", books);
      return res.status(200).json(books);
    })
    .catch((err) => {
      console.log("🚀 ~ err:", err);
      return res.status(404).json({ err });
    });
};
//UPDATE
exports.modifyBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res
          .status(401)
          .json({ message: "Vous n'êtes pas autorisé à modifier ce livre" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id },
        )
          .then(() => res.status(200).json({ message: "Livre modifié !" }))
          .catch((err) => res.status(400).json({ err }));
      }
    })
    .catch((err) => res.status(400).json({ err }));
};

exports.addRating = (req, res) => {
  const { userId, rating } = req.body;
  if (rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5." });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const hasRated = book.ratings.some((r) => r.userId === userId);
      if (hasRated) {
        return res.status(400).json({
          message: "Un utilisateur ne peut pas noter deux fois le même livre.",
        });
      }

      const newRating = { userId, grade: rating };
      const newRatings = [...book.ratings, newRating];

      const total = newRatings.reduce((acc, curr) => acc + curr.grade, 0);
      const averageRating = total / newRatings.length;

      Book.updateOne(
        { _id: req.params.id },
        {
          $push: { ratings: newRating },
          $set: { averageRating: averageRating },
        },
      )
        .then(() => {
          book.ratings.push(newRating);
          book.averageRating = averageRating;
          res.status(201).json(book);
        })
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(404).json({ err }));
};
//DELETE

exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res
          .status(401)
          .json({ message: "Vous n'êtes pas autorisé à supprimer ce livre" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        const sanitizedFilename = path.basename(filename);
        const filePath = path.join("images", sanitizedFilename);
        fs.unlink(filePath, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre supprimé !" }))
            .catch((err) => res.status(401).json({ err }));
        });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};
