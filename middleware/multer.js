const multer = require("multer");
const path = require("path");
// require("../upload/images")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destination = "";

        // Determine destination directory based on file type
        if (file.mimetype.startsWith("image")) {
            destination = path.join(__dirname, "../upload/images/");
        } else {
            destination = path.join(__dirname, "../upload/files/");
        }

        // Ensure the destination directory exists
        fs.mkdirSync(destination, { recursive: true });

        cb(null, destination);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the fieldname, current timestamp, and original extension
        const uniqueFilename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000000
    }
});

module.exports = {
    storage: storage,
    upload: upload
};
