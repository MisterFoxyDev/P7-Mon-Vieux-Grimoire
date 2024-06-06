const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//CREATE
router.post("/", auth, multer, booksCtrl.createBook);
router.post("/:id/rating", auth, )
//READ
router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
//UPDATE
router.put("/:id", auth, booksCtrl.modifyBook);
//DELETE
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;
