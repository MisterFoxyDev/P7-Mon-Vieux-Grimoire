"use strict";

const multer = require("multer");
const sharp = require("sharp");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/tiff": "tiff",
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

const resizeAndCompressImage = (req, res, next) => {
  if (!req.file) return next();
  const extension = "webp";
  req.file.filename = `${Date.now()}.${extension}`;

  sharp(req.file.buffer)
    .resize(404, 536, {
      fit: sharp.fit.inside,
      withoutEnlargement: false,
    })
    .webp({ quality: 90 })
    .toFile(`images/${req.file.filename}`)
    .then(() => next())
    .catch((error) => res.status(400).json({ error }));
};

module.exports = {
  upload,
  resizeAndCompressImage,
};
