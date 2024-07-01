const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//CREATE
router.post("/", auth, multer.upload.single("image"), multer.resizeAndCompressImage, booksCtrl.createBook);
<<<<<<< HEAD

=======
>>>>>>> 52b514e2779dc75e315512acf679c1205e55e938
//READ
router.get("/", booksCtrl.getAllBooks);
router.get("/bestrating", booksCtrl.getBestRating);
router.get("/:id", booksCtrl.getOneBook);
//UPDATE
router.put("/:id", auth, multer.upload.single("image"), multer.resizeAndCompressImage, booksCtrl.modifyBook);
router.post("/:id/rating", auth, booksCtrl.addRating);
//DELETE
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;
