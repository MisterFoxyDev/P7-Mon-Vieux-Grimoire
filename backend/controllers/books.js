const Book = require("../models/Book");

//CREATE
exports.createBook = (req, res) => {
  const bookObj = JSON.parse(req.body.book);
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

// exports.createRating = req
//READ
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      console.log("🚀 ~ book:", book);
      return res.status(200).json(book);
    })
    .catch((err) => res.status(404).json({ err }));
};
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ err }));
};
//UPDATE
exports.modifyBook = (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Modification effectuée !" }))
    .catch((err) => res.status(400).json({ err }));
};
//DELETE
exports.deleteBook = (req, res) => {
  Book.deleteOne({
    _id: req.params.id,
  })
    .then(() => res.status(200).json({ message: "Livre supprimé" }))
    .catch((err) => res.status(400).json({ err }));
};
