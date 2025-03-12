const multer = require('multer');

const storage = multer.diskStorage({
    // Kelayotgan fayl qayerga tushishini belgilaydi 
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    // Kelayotgan faylga unique nom beradi 
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage });

const uploadMiddleware = upload.single('photo');
console.log(uploadMiddleware);

module.exports = uploadMiddleware;