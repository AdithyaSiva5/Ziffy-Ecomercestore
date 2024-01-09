const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({ storage: storage });


const bannerImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/banners");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const bannerUpload = multer({ storage: bannerImage });



module.exports = { uploads, bannerUpload };