const multer = require('multer')

const fileFilter = (req, file, callback) => {
  if (file.mimetype.split("/")[0] === "image") {
    callback(null, true)
  } else {
    callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
  }
}

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "public/data/uploads");
//   },
//   filename: (req, file, callback) => {
//     const { originalname } = file
//     callback(null, `${uuid()}-${originalname}`)
//   }
// })
// const upload = multer({ storage, fileFilter, limits: { fileSize: 3000 * 3000 * 5 } })

const multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size too large!" })
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files!" })
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "File must be an image" })
    }
  }
};

const memoryStorage = multer.memoryStorage();
const upload = multer({
  memoryStorage,
  fileFilter,
  limits: { fileSize: 3000 * 3000 * 5 }
});

module.exports = { upload, multerErrorHandling };
